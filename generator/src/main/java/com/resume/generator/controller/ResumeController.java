package com.resume.generator.controller;

import com.resume.generator.service.FileStorageService;
import com.resume.generator.service.ResumeOrchestrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipEntry;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"https://resume-generator-forntend.onrender.com", "http://localhost:3000"})
public class ResumeController {

    @Autowired
    private ResumeOrchestrationService orchestrationService;

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Endpoint for the final "MAKE" button.
     * It saves the generated files and returns download links.
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateResume(@RequestBody Object resumeRequest) {
        try {
            byte[] zipFileBytes = orchestrationService.callPythonService(resumeRequest).block();
            if (zipFileBytes == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to get response from Python service.");
            }
            
            String sessionId = fileStorageService.saveAndUnzipFiles(zipFileBytes);

            Map<String, String> response = Map.of(
                "pdfUrl", "/api/v1/download/" + sessionId + "/resume.pdf",
                "latexUrl", "/api/v1/download/" + sessionId + "/resume.tex",
                "jsonUrl", "/api/v1/download/" + sessionId + "/resume.json"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Generation failed: " + e.getMessage());
        }
    }
    
    /**
     * Endpoint for the live preview.
     * It returns the raw PDF bytes directly to the browser for inline viewing.
     */
    @PostMapping("/preview")
    public ResponseEntity<byte[]> previewResume(@RequestBody Object resumeRequest) {
        try {
            byte[] zipFileBytes = orchestrationService.callPythonService(resumeRequest).block();
            if (zipFileBytes == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            // Unzip the PDF from the byte array in memory
            byte[] pdfBytes = unzipFileFromBytes(zipFileBytes, "resume.pdf");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // This header tells the browser to display the file inline, not download it
            headers.setContentDisposition(ContentDisposition.inline().build());

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint to serve the saved files for download.
     */
    @GetMapping("/download/{sessionId}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String sessionId, @PathVariable String fileName) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(sessionId, fileName);
            String contentType = "application/octet-stream";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Helper method to extract a single file's bytes from a zip byte array in memory.
     * @param zipBytes The raw bytes of the zip file.
     * @param fileNameToExtract The name of the file to extract from the archive.
     * @return The raw bytes of the extracted file.
     * @throws IOException if the file is not found or an error occurs.
     */
    private byte[] unzipFileFromBytes(byte[] zipBytes, String fileNameToExtract) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipBytes))) {
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                if (fileNameToExtract.equals(zipEntry.getName())) {
                    ByteArrayOutputStream bos = new ByteArrayOutputStream();
                    byte[] buffer = new byte[1024];
                    int len;
                    while ((len = zis.read(buffer)) > 0) {
                        bos.write(buffer, 0, len);
                    }
                    return bos.toByteArray();
                }
                zipEntry = zis.getNextEntry();
            }
        }
        throw new IOException("File not found in zip archive: " + fileNameToExtract);
    }
}