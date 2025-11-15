import Job from '../models/Job.js';

// Create a new job
export async function createJob(req, res) {
    try {
        console.log('=== CREATE JOB REQUEST ===');
        console.log('Request body:', req.body);
        console.log('Session user:', req.session?.user);
        
        const { title, type, location, description, salary, company } = req.body;
        
        if (!title || !type || !location || !description || !salary || !company) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        if (!company.name || !company.contactEmail) {
            console.log('Missing company details');
            return res.status(400).json({ message: 'Company name and contact email are required' });
        }

        const jobData = {
            title,
            type,
            location,
            description,
            salary,
            company,
            author: req.session.user.id
        };
        
        console.log('Creating job with data:', jobData);
        const job = new Job(jobData);

        console.log('Saving job to database...');
        await job.save();
        console.log('Job saved successfully:', job._id);
        
        await job.populate('author', 'name email');
        console.log('Job populated with author data');

        res.status(201).json({
            message: 'Job created successfully',
            job
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ message: 'Error creating job' });
    }
}

// Get all jobs
export async function getAllJobs(req, res) {
    try {
        console.log('=== GET ALL JOBS REQUEST ===');
        const jobs = await Job.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        console.log(`Found ${jobs.length} jobs in database`);
        if (jobs.length > 0) {
            console.log('First job:', jobs[0]);
        }

        res.json({ jobs });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
}

// Get single job by ID
export async function getJobById(req, res) {
    try {
        const job = await Job.findById(req.params.id)
            .populate('author', 'name email');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json({ job });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ message: 'Error fetching job' });
    }
}

// Update job (only author)
export async function updateJob(req, res) {
    try {
        const { title, type, location, description, salary, company } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.author.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Access denied. You can only edit your own jobs' });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (type) updateData.type = type;
        if (location) updateData.location = location;
        if (description) updateData.description = description;
        if (salary) updateData.salary = salary;
        if (company) updateData.company = company;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        res.json({
            message: 'Job updated successfully',
            job: updatedJob
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({ message: 'Error updating job' });
    }
}

// Delete job (only author)
export async function deleteJob(req, res) {
    try {
        const jobId = req.params.id;
        
        if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
            return res.status(400).json({ message: 'Invalid job ID format' });
        }

        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.author.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Access denied. You can only delete your own jobs' });
        }

        await Job.findByIdAndDelete(jobId);

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ message: 'Error deleting job' });
    }
}