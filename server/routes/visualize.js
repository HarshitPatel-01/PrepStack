const express = require('express');
const router = express.Router();
const { visualizeCode } = require('../utils/visualize');

// POST /api/visualize
// Body: { code: string, language: 'python' | 'cpp' | 'c' }
// Returns: { success, steps, totalSteps, code, language, finalStdout }
router.post('/', async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                error: 'Both "code" and "language" are required.'
            });
        }

        // Security: limit code size to prevent abuse
        if (code.length > 10000) {
            return res.status(400).json({
                success: false,
                error: 'Code exceeds maximum length (10,000 characters).'
            });
        }

        // Only allow supported languages
        const supported = ['python', 'cpp', 'c'];
        if (!supported.includes(language)) {
            return res.status(400).json({
                success: false,
                error: `Unsupported language "${language}". Supported: ${supported.join(', ')}`
            });
        }

        console.log(`[Visualizer] Tracing ${language} code (${code.length} chars)`);

        const result = await visualizeCode(language, code);

        console.log(`[Visualizer] Completed: ${result.success ? result.totalSteps + ' steps' : 'ERROR'}`);

        res.json(result);
    } catch (err) {
        console.error('[Visualizer] Server error:', err);
        res.status(500).json({
            success: false,
            error: `Server error: ${err.message}`
        });
    }
});

module.exports = router;
