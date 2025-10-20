import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TutorApplicationEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: TutorApplicationEmailRequest = await req.json();

    console.log("Sending tutor application confirmation email to:", email);

    const emailResponse = await resend.emails.send({
      from: "CampusLearn <onboarding@resend.dev>",
      to: [email],
      subject: "Tutor Application Submitted - Under Review",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Thank you for applying, ${name}!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Your request to become a tutor is currently under review.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Our team will carefully review your application and get back to you within 3-5 business days.
          </p>
          <div style="background-color: #f1f5f9; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
            <p style="color: #475569; margin: 0; font-size: 14px;">
              <strong>What happens next?</strong><br>
              • Our team reviews your qualifications and experience<br>
              • You'll receive an email notification once the review is complete<br>
              • If approved, you'll gain access to tutor features immediately
            </p>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Thank you for your interest in helping other students succeed!
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Best regards,<br>
            <strong>The CampusLearn Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-tutor-application-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
