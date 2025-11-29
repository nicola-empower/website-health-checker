# Website Health Checker - Application Notes

## Overview
The **Website Health Checker** is a diagnostic tool designed to help website owners understand how their site performs in three critical areas: **Performance**, **SEO**, and **Accessibility**. It uses industry-standard data to provide a clear, jargon-free report and actionable next steps.

---

## 1. How It Works: The Analysis Process

1.  **Input**: The user enters their website URL (e.g., `mysite.com`).
2.  **API Request**: The app sends this URL to the **Google PageSpeed Insights API**.
3.  **Dual Scan**: It performs two simultaneous checks:
    *   **Mobile Analysis**: Simulates a mobile device (Moto G4) on a 4G network. This is crucial because Google prioritises mobile-first indexing.
    *   **Desktop Analysis**: Simulates a standard desktop browsing experience.
4.  **Data Retrieval**: The app retrieves raw scores (0-100) for Performance, SEO, and Accessibility from Google's Lighthouse auditing tool.

---

## 2. Understanding the Results

The results are presented in a simple dashboard with colour-coded scores.

### The Scoring System
*   **Performance**: How fast the page loads and becomes interactive.
*   **SEO (Search Engine Optimisation)**: How well the site is set up to be found by Google.
*   **Accessibility**: How usable the site is for people with disabilities (e.g., screen readers).

### The Traffic Light Zones
The app categorises each score into one of three "zones" to help users understand the severity:

*   🔴 **Red Zone Rescue (Score 0-49)**
    *   **Meaning**: Critical issues are actively harming the site's ranking and user experience.
    *   **Impact**: High bounce rates, poor Google ranking, lost customers.
    *   **Action**: Immediate "Rescue" work is needed.

*   🟠 **Amber Zone Audit (Score 50-89)**
    *   **Meaning**: The site is functional but has significant room for improvement.
    *   **Impact**: The site is "okay" but likely losing out to faster, better-optimised competitors.
    *   **Action**: A full audit and optimisation package is recommended.

*   🟢 **Green Zone Polish (Score 90-100)**
    *   **Meaning**: Excellent health. The site is performing at a top-tier level.
    *   **Impact**: Best possible chance of ranking high and converting visitors.
    *   **Action**: Optional "Polish" to maintain perfection.

---

## 3. The Action Plan & Services

After the analysis, the app asks the user for their **Platform** (WordPress, Wix, Squarespace, etc.) and **Site Size** to generate a custom Action Plan.

### Smart Recommendations
The app logic automatically suggests the most appropriate service package based on the *lowest* scores found:

1.  **Critical Site Rescue Package**
    *   **Trigger**: If *all three* scores (Performance, SEO, Accessibility) are in the **Red Zone**.
    *   **Offer**: A complete overhaul to fix foundational issues.

2.  **Full Optimisation Package**
    *   **Trigger**: If scores are generally in the **Amber Zone**.
    *   **Offer**: A comprehensive tune-up to push everything into the Green.

3.  **Perfectionist Polish**
    *   **Trigger**: If scores are already **Green**.
    *   **Offer**: A low-cost service to fix minor warnings and maintain 100% scores.

4.  **Targeted Fixes**
    *   **Trigger**: If only *one* specific area is failing (e.g., just Performance is Red).
    *   **Offer**: Specific services like "WordPress Quick Win" (caching/image optimisation) or "SEO Audit".

### Pricing Logic
*   **Base Price**: Each severity tier has a base cost (Red = £300, Amber = £150, Green = £75).
*   **Multipliers**:
    *   **Site Size**: Medium sites (11-50 pages) cost 1.5x more. Large sites trigger a "Custom Quote".
    *   **Platform**: Non-WordPress sites (Wix/Squarespace) are slightly cheaper (0.75x) as they often have fewer technical levers to pull, limiting the scope of work.

---

## 4. What Happens Next?

When a user clicks "Request This Service":
1.  A modal opens confirming the service and estimated price.
2.  The user enters their Name and Email.
3.  The form is submitted via **Formspree**.
4.  You (the admin) receive an email with all the details:
    *   Client Name & Email
    *   Website URL
    *   Service Requested
    *   The specific scores they received
5.  **Action**: You reply to the lead to confirm the booking and start the work.
