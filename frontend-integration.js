// API service function for your React frontend
const API_BASE_URL = 'http://localhost:3000'; // Adjust port if different

export const jobService = {
  // Create a new job
  async createJob(jobData) {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create job');
    }

    return response.json();
  },

  // Get all jobs
  async getAllJobs() {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  },

  // Get job by ID
  async getJobById(id) {
    const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  }
};

// Update your AddJobPage component to use this:
// Replace the addJobSubmit prop with:
/*
import { jobService } from './path/to/jobService';

const AddJobPage = () => {
  // ... your existing state

  const submitForm = async (e) => {
    e.preventDefault();

    const newJob = {
      title,
      type,
      location,
      description,
      salary,
      company: {
        name: companyName,
        description: companyDescription,
        contactEmail,
        contactPhone,
      },
    };

    try {
      await jobService.createJob(newJob);
      toast.success("Job Added Successfully");
      navigate("/jobs");
    } catch (error) {
      toast.error(error.message || "Failed to add job. Please try again.");
    }
  };

  // ... rest of your component
};
*/