import Post from '../models/Post.js';

// Create a new post
export async function createPost(req, res) {
    try {
        const { title, content, image } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const post = new Post({
            title,
            content,
            image: image || null,
            author: req.session.user.id
        });

        await post.save();
        await post.populate('author', 'name email profileImage');

        res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
}

// Get all posts
export async function getAllPosts(req, res) {
    try {
        const posts = await Post.find()
            .populate('author', 'name email profileImage')
            .sort({ createdAt: -1 });

        res.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
}

// Get single post by ID
export async function getPostById(req, res) {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email profileImage');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ post });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ message: 'Error fetching post' });
    }
}

// Update post (only author)
export async function updatePost(req, res) {
    try {
        const { title, content, image } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Access denied. You can only edit your own posts' });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (image !== undefined) updateData.image = image;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'name email profileImage');

        res.json({
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ message: 'Error updating post' });
    }
}

// Delete post (only author)
export async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Access denied. You can only delete your own posts' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
}