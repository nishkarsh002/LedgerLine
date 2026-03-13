import axios from 'axios';

const sendEmail = async (options) => {
    try {
        console.log(`📡 Attempting to send email to: ${options.email} via Resend API...`);
        
        const response = await axios.post('https://api.resend.com/emails', {
            from: 'LedgerLine <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            // Fix for "unable to get local issuer certificate" in some dev environments
            httpsAgent: process.env.NODE_ENV === 'development' ? new (await import('https')).Agent({
                rejectUnauthorized: false
            }) : undefined
        });

        console.log('📧 Email sent successfully via Resend API:', response.data.id);
        return response.data;
    } catch (err) {
        console.log('\n--- 🧪 DEVELOPMENT EMAIL LOG ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`OTP/Message: ${options.message}`);
        console.log('--------------------------------\n');

        if (err.response) {
            console.error('❌ Resend API Error Response:', err.response.data);
        } else {
            console.error('❌ Resend Request Failed:', err.message);
        }
        
        // Don't throw error in dev mode so the app doesn't crash
        return { id: 'mock-id' };
    }
};

export default sendEmail;
