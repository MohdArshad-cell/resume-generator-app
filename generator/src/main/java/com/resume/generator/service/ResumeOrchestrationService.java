package com.resume.generator.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Duration; // Add this import

@Service
public class ResumeOrchestrationService {

    private final WebClient webClient;

    public ResumeOrchestrationService(WebClient.Builder webClientBuilder, @Value("${python.service.url}") String pythonServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(pythonServiceUrl).build();
    }

    public Mono<byte[]> callPythonService(Object resumeRequestDto) {
        return webClient.post()
                .uri("")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(resumeRequestDto)
                .retrieve()
                .bodyToMono(byte[].class)
                .timeout(Duration.ofSeconds(120)); // Increase timeout to 2 minutes // Add this timeout
    }
}