# GoHighLevel Webhook Setup Instructions

## Overview
To automatically send sales intelligence emails when prospects book calls through your GoHighLevel calendar, you need to configure a webhook in your GoHighLevel account.

## Webhook Configuration

### Step 1: Get Your Webhook URL
Your webhook URL is:
```
https://YOUR-REPLIT-APP.replit.dev/api/webhooks/gohighlevel
```

Replace `YOUR-REPLIT-APP.replit.dev` with your actual Replit app domain.

### Step 2: Configure Webhook in GoHighLevel

There are two ways to set up the webhook in GoHighLevel:

#### Option A: Using Workflows (Recommended)

1. **Navigate to Workflows**
   - Log into your GoHighLevel account
   - Go to **Automations → Workflows**

2. **Create New Workflow**
   - Click **Create Workflow**
   - Name it: "Revenue Leak - Sales Intelligence"
   - Choose trigger: **Calendar Booking**

3. **Configure Trigger**
   - Select your calendar: **fix-your-phone-leak**
   - Trigger on: **Appointment Booked**

4. **Add Webhook Action**
   - Click **Add Action**
   - Search for and select **Send Webhook**
   - Configure:
     - **Webhook URL**: `https://YOUR-REPLIT-APP.replit.dev/api/webhooks/gohighlevel`
     - **Method**: POST
     - **Content Type**: application/json

5. **Add Custom Headers**
   - Click **Add Header**
   - **Header Name**: `x-webhook-secret`
   - **Header Value**: Your webhook secret (the value you configured in Replit Secrets)

6. **Configure Request Body**
   ```json
   {
     "firstName": "{{contact.first_name}}",
     "lastName": "{{contact.last_name}}",
     "email": "{{contact.email}}",
     "phone": "{{contact.phone}}",
     "company": "{{contact.company_name}}",
     "diagnosticId": "{{contact.diagnosticId}}",
     "webhookSecret": "YOUR_WEBHOOK_SECRET"
   }
   ```
   Replace `YOUR_WEBHOOK_SECRET` with the actual secret you configured.
   
   **Note**: The `diagnosticId` is passed from the booking calendar URL and should be captured in a custom field or contact field.

7. **Save and Publish**
   - Click **Save**
   - Set workflow status to **Active**

#### Option B: Using Custom Values (Alternative)

If you prefer to use GoHighLevel's custom values:

1. Create a **Custom Value** in your calendar settings
2. Add the webhook URL as a custom value
3. Configure it to fire on appointment booking

### Step 3: Test the Webhook

1. **Run a Test Booking**
   - Book a test appointment through your calendar widget
   - Use a real email address you can check

2. **Check Backend Logs**
   - Look for: `📅 GoHighLevel webhook received:`
   - Then: `✅ Sales intelligence email sent for GHL booking`

3. **Verify Email Delivery**
   - Check the SALES_EMAIL inbox
   - You should receive the sales intelligence report with:
     - Contact information
     - Revenue recovery metrics
     - Call analytics
     - After-hours insights

## Webhook Payload

The webhook endpoint expects this data structure:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Plumbing",
  "diagnosticId": "abc123xyz",
  "webhookSecret": "your-webhook-secret"
}
```

**Alternative field names supported:**
- `name` instead of `firstName` + `lastName`
- `contactEmail` instead of `email`
- `contactPhone` instead of `phone`
- `companyName` instead of `company`
- `diagnostic_id` instead of `diagnosticId`

**Important**: The `diagnosticId` field ensures each booking gets matched to their specific diagnostic data. This is passed as a URL parameter to the booking calendar and should be captured in GoHighLevel.

## Security

The webhook is protected by a secret key:
- Set `GOHIGHLEVEL_WEBHOOK_SECRET` in Replit Secrets
- Include the secret in webhook requests via:
  - HTTP header: `x-webhook-secret: YOUR_SECRET`
  - OR body field: `webhookSecret: YOUR_SECRET`

## Troubleshooting

### Webhook not firing
- ✅ Check workflow is **Active**
- ✅ Verify calendar trigger is correct
- ✅ Confirm webhook URL is correct (no typos)
- ✅ Check GoHighLevel workflow execution logs

### 401 Unauthorized Error
- ❌ Webhook secret doesn't match
- ✅ Verify `GOHIGHLEVEL_WEBHOOK_SECRET` in Replit
- ✅ Check secret is correctly passed in header or body

### 400 Bad Request Error
- ❌ Missing required fields (name or email)
- ✅ Verify contact fields are mapped correctly
- ✅ Check webhook payload in logs

### No Email Received
- ✅ Check backend logs for email errors
- ✅ Verify Resend domain is verified
- ✅ Confirm SALES_EMAIL is configured correctly
- ✅ Check spam folder

### Wrong Diagnostic Data
- ⚠️ If diagnosticId is missing, webhook falls back to most recent diagnostic
- ✅ Make sure diagnosticId is captured from URL parameter and passed to webhook
- ✅ The booking calendar URL includes: `?diagnosticId=XYZ` - capture this value
- ℹ️ Set up a custom field in GHL to capture diagnosticId from URL parameter

## How It Works

1. **User Journey**
   - User connects phone system → Analyzes data → Sees revenue leak
   - Clicks "Fix This" → GoHighLevel booking calendar loads
   - User books appointment → GHL creates the appointment

2. **Backend Process**
   - GHL triggers webhook to your app
   - App validates webhook secret
   - App retrieves most recent diagnostic data
   - App sends sales intelligence email with full report

3. **Sales Team Receives**
   - Contact info (name, email, phone, company)
   - Revenue recovery opportunity (35% conversion estimate)
   - Total revenue loss
   - Missed calls, after-hours calls, answer rate
   - Average callback time
   - Key insights

## Support

For additional help:
- GoHighLevel Support: https://help.gohighlevel.com/
- Webhook Documentation: https://help.gohighlevel.com/support/solutions/48000449585
