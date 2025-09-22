import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ResumeData, DownloadLinks } from '../types';

import Sidebar from '../components/Sidebar';
import TemplateSelection from '../forms/TemplateSelection';
import ProfileForm from '../forms/ProfileForm';
import EducationForm from '../forms/EducationForm';
import WorkForm from '../forms/WorkForm';
import SkillsForm from '../forms/SkillsForm';
import ProjectsForm from '../forms/ProjectsForm';
import PreviewPanel from '../components/PreviewPanel';
import AchievementsForm from '../forms/AchievementsForm';
import CertificationsForm from '../forms/CertificationsForm';

const initialResumeData: ResumeData = {
  personal_info: { full_name: '', address: '', email: '', phone: '', github_handle: '', linkedin_handle: '', portfolio_url: '' },
  // These start with one blank entry for a better user experience
  education: [{ id: uuidv4(), degree: '', institution: '', start_year: '', end_year: '', gpa: '' }],
  work_experience: [{ id: uuidv4(), job_title: '', company_name: '', location: '', start_date: '', end_date: '', description_points: '' }],
  projects: [{ id: uuidv4(), project_name: '', start_date: '', end_date: '', tech_stack: '', description_points: '' }],
  
  // UPDATED: These now start as empty arrays
  skills: [], 
  achievements: [],
  certifications: [],
};
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ResumeBuilderPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Templates');
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState('Elegant');
  
  // State for the final generation ("MAKE" button)
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // State for the live preview feature
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  /**
   * Handles the automatic live preview.
   * Fetches the raw PDF data as a 'blob' and creates a local URL for display.
   */
  const handlePreviewUpdate = async (data: ResumeData, template: string) => {
    setIsPreviewLoading(true);
    setDownloadLinks(null);
    setErrorMessage('');
    
    const payload = {
        template_name: template.toLowerCase().replace(/ /g, '_'),
        resume_data: {
            ...data,
            work_experience: data.work_experience.map(exp => ({ ...exp, description_points: exp.description_points.split('\n').filter(p => p.trim() !== '') })),
            projects: data.projects.map(proj => ({ ...proj, description_points: proj.description_points.split('\n').filter(p => p.trim() !== '') }))
        }
    };

    try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/preview`, payload, {
            responseType: 'blob' 
        });
        
        const blobUrl = URL.createObjectURL(response.data);
        setPreviewPdfUrl(blobUrl);

    } catch (error) {
        console.error("Error generating preview:", error);
        setErrorMessage('Auto-preview failed.');
    } finally {
        setIsPreviewLoading(false);
    }
  };

  /**
   * This hook triggers the live preview function after the user stops typing.
   * It also cleans up the created blob URL to prevent memory leaks.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
        // We check if there's some data before making an API call
        if (resumeData.personal_info.full_name || resumeData.education[0].institution) {
            handlePreviewUpdate(resumeData, selectedTemplate);
        }
    }, 1500); // 1.5 second delay

    // Cleanup function
    return () => {
        clearTimeout(handler);
        if (previewPdfUrl) {
            URL.revokeObjectURL(previewPdfUrl);
        }
    };
  }, [resumeData, selectedTemplate]);

  /**
   * Handles the final "MAKE" button click.
   * Fetches the download links for all file types.
   */
  const handleMakeResume = async () => {
    // 1. Set loading state and clear any previous errors
    setIsLoading(true);
    setErrorMessage('');

    // 2. Prepare the data payload for the API
    // This transforms the form data into the format the backend expects
    const payload = {
        template_name: selectedTemplate.toLowerCase().replace(/ /g, '_'),
        resume_data: {
            ...resumeData,
            // Convert newline-separated strings into arrays of strings
            work_experience: resumeData.work_experience.map(exp => ({
                ...exp,
                description_points: exp.description_points.split('\n').filter(p => p.trim() !== ''),
            })),
            projects: resumeData.projects.map(proj => ({
                ...proj,
                description_points: proj.description_points.split('\n').filter(p => p.trim() !== ''),
            })),
        },
    };

    try {
        // 3. Make the API call, requesting the response as a 'blob'
        const response = await axios.post(`${API_BASE_URL}/api/v1/generate`, payload, {
            responseType: 'blob',
        });

        // 4. Trigger the file download in the browser
        const blobUrl = URL.createObjectURL(response.data);
        const link = document.createElement('a');

        link.href = blobUrl;
        link.setAttribute('download', 'resume_files.zip'); // Set the download filename

        // Append, click, and remove the link to start the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL to free up memory
        URL.revokeObjectURL(blobUrl);

    } catch (error) {
        // 5. Handle any errors during the process
        console.error("Error generating resume:", error);
        setErrorMessage('Failed to generate final resume files. Please try again.');
    } finally {
        // 6. Always turn off the loading indicator
        setIsLoading(false);
    }
};

  const renderActiveForm = () => {
    switch (activeSection) {
      case 'Templates': return <TemplateSelection selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />;
      case 'Profile': return <ProfileForm data={resumeData.personal_info} setData={(newData) => setResumeData({ ...resumeData, personal_info: newData })} />;
      case 'Education': return <EducationForm data={resumeData.education} setData={(newData) => setResumeData({ ...resumeData, education: newData })} />;
      case 'Work': return <WorkForm data={resumeData.work_experience} setData={(newData) => setResumeData({ ...resumeData, work_experience: newData })} />;
      case 'Projects': return <ProjectsForm data={resumeData.projects} setData={(newData) => setResumeData({ ...resumeData, projects: newData })} />;
      case 'Skills': return <SkillsForm data={resumeData.skills} setData={(newData) => setResumeData({ ...resumeData, skills: newData })} />;
      case 'Achievements': return <AchievementsForm data={resumeData.achievements} setData={(newData) => setResumeData({ ...resumeData, achievements: newData })} />;
      case 'Certifications': return <CertificationsForm data={resumeData.certifications} setData={(newData) => setResumeData({ ...resumeData, certifications: newData })} />;
      default: return <TemplateSelection selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />;
    }
};

  return (
    <div className="app-container">
      <div className="nav-panel">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onMakeResume={handleMakeResume} />
      </div>
      <div className="editor-panel" style={{ overflowY: 'auto' }}>
        {renderActiveForm()}
      </div>
      <div className="preview-panel">
        <PreviewPanel 
          isLoading={isLoading || isPreviewLoading} 
          downloadLinks={downloadLinks} 
          errorMessage={errorMessage}
          previewPdfUrl={previewPdfUrl}
        />
      </div>
    </div>
  );
};

export default ResumeBuilderPage;