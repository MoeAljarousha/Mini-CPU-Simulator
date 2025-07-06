import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'contact' | 'service' | 'testdrive';
  formData: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, formData }: EmailRequest = await req.json();
    
    console.log(`Processing ${type} email request:`, formData);

    let businessEmailHtml = '';
    let customerEmailHtml = '';
    let subject = '';

    if (type === 'contact') {
      subject = `New Contact Form Submission from ${formData.name}`;
      
      businessEmailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Customer Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${formData.name}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Message:</strong> ${formData.message}</li>
        </ul>
        <p><strong>Company Contact:</strong></p>
        <ul>
          <li><strong>Business:</strong> Breeze Motors</li>
          <li><strong>Address:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</li>
          <li><strong>Phone:</strong> (519) 971-0000</li>
          <li><strong>Email:</strong> Hazem@breezemotors.ca</li>
        </ul>
      `;

      customerEmailHtml = `
        <h2>Thank you for contacting Breeze Motors!</h2>
        <p>Dear ${formData.name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p><strong>Your Message:</strong></p>
        <p>${formData.message}</p>
        <p><strong>Our Contact Information:</strong></p>
        <ul>
          <li><strong>Address:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</li>
          <li><strong>Phone:</strong> (519) 971-0000</li>
          <li><strong>Email:</strong> Hazem@breezemotors.ca</li>
          <li><strong>Hours:</strong> Monday-Saturday 9:00 AM to 5:00 PM</li>
        </ul>
        <p>Best regards,<br>The Breeze Motors Team</p>
      `;
    } else if (type === 'service') {
      subject = `Service Appointment Booking - ${formData.serviceType}`;
      
      businessEmailHtml = `
        <h2>New Service Appointment Booking</h2>
        <p><strong>You have a customer coming in for service!</strong></p>
        <p><strong>Customer Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${formData.name}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Phone:</strong> ${formData.phone}</li>
        </ul>
        <p><strong>Service Details:</strong></p>
        <ul>
          <li><strong>Service Type:</strong> ${formData.serviceType}</li>
          <li><strong>Vehicle Info:</strong> ${formData.vehicleInfo || 'Not provided'}</li>
          <li><strong>Preferred Date:</strong> ${formData.preferredDate || 'Not specified'}</li>
          <li><strong>Preferred Time:</strong> ${formData.preferredTime || 'Not specified'}</li>
          <li><strong>Additional Notes:</strong> ${formData.additionalNotes || 'None'}</li>
        </ul>
        <p><strong>Location:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</p>
      `;

      customerEmailHtml = `
        <h2>Service Appointment Confirmation</h2>
        <p>Dear ${formData.name},</p>
        <p>Thank you for booking a service appointment with Breeze Motors. We will contact you within 24 hours to confirm your appointment details.</p>
        <p><strong>Your Service Request:</strong></p>
        <ul>
          <li><strong>Service Type:</strong> ${formData.serviceType}</li>
          <li><strong>Vehicle Info:</strong> ${formData.vehicleInfo || 'Not provided'}</li>
          <li><strong>Preferred Date:</strong> ${formData.preferredDate || 'Not specified'}</li>
          <li><strong>Preferred Time:</strong> ${formData.preferredTime || 'Not specified'}</li>
        </ul>
        <p><strong>Our Location:</strong></p>
        <ul>
          <li><strong>Address:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</li>
          <li><strong>Phone:</strong> (519) 971-0000</li>
          <li><strong>Email:</strong> Hazem@breezemotors.ca</li>
          <li><strong>Hours:</strong> Monday-Saturday 9:00 AM to 5:00 PM</li>
        </ul>
        <p>Best regards,<br>The Breeze Motors Team</p>
      `;
    } else if (type === 'testdrive') {
      subject = `Test Drive Appointment - ${formData.carDetails || 'Vehicle'}`;
      
      businessEmailHtml = `
        <h2>New Test Drive Appointment</h2>
        <p><strong>You have a customer coming in for a test drive!</strong></p>
        <p><strong>Customer Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${formData.name}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Phone:</strong> ${formData.phone}</li>
          <li><strong>Driver's License:</strong> ${formData.driversLicense}</li>
        </ul>
        <p><strong>Vehicle Details:</strong></p>
        <ul>
          <li><strong>Vehicle:</strong> ${formData.carDetails || 'Not specified'}</li>
          <li><strong>Preferred Date:</strong> ${formData.preferredDate || 'Not specified'}</li>
          <li><strong>Preferred Time:</strong> ${formData.preferredTime || 'Not specified'}</li>
          <li><strong>Additional Notes:</strong> ${formData.additionalNotes || 'None'}</li>
        </ul>
        <p><strong>Location:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</p>
      `;

      customerEmailHtml = `
        <h2>Test Drive Appointment Confirmation</h2>
        <p>Dear ${formData.name},</p>
        <p>Thank you for booking a test drive with Breeze Motors. We will contact you within 24 hours to confirm your appointment details.</p>
        <p><strong>Your Test Drive Request:</strong></p>
        <ul>
          <li><strong>Vehicle:</strong> ${formData.carDetails || 'Not specified'}</li>
          <li><strong>Preferred Date:</strong> ${formData.preferredDate || 'Not specified'}</li>
          <li><strong>Preferred Time:</strong> ${formData.preferredTime || 'Not specified'}</li>
        </ul>
        <p><strong>Important Reminder:</strong> Please bring a valid driver's license and proof of insurance for the test drive.</p>
        <p><strong>Our Location:</strong></p>
        <ul>
          <li><strong>Address:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</li>
          <li><strong>Phone:</strong> (519) 971-0000</li>
          <li><strong>Email:</strong> Hazem@breezemotors.ca</li>
          <li><strong>Hours:</strong> Monday-Saturday 9:00 AM to 5:00 PM</li>
        </ul>
        <p>Best regards,<br>The Breeze Motors Team</p>
      `;
    }

    // Send email to business owners
    const businessEmail = await resend.emails.send({
      from: "Breeze Motors <onboarding@resend.dev>",
      to: ["Hi_ja72@hotmail.com", "Hazem@breezemotors.ca"],
      subject: subject,
      html: businessEmailHtml,
    });

    console.log("Business email sent:", businessEmail);

    // Send confirmation email to customer
    const customerEmail = await resend.emails.send({
      from: "Breeze Motors <onboarding@resend.dev>",
      to: [formData.email],
      subject: `Confirmation: ${subject}`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        businessEmailId: businessEmail.data?.id,
        customerEmailId: customerEmail.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
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