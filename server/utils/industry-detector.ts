/**
 * Detects industry from company name using keyword matching
 * Targets home service and medical/dental businesses
 */
export function detectIndustry(companyName: string): string {
  if (!companyName) return "Home Services";
  
  const name = companyName.toLowerCase();
  
  // Plumbing
  if (name.match(/plumb|pipe|drain|sewer|water\s*(heat|line)/)) {
    return "Plumbing";
  }
  
  // HVAC
  if (name.match(/hvac|heat|cool|air\s*cond|furnace|ac\s|a\/c/)) {
    return "HVAC";
  }
  
  // Electrical
  if (name.match(/electric|electrical|electrician|wiring|electric/)) {
    return "Electrical";
  }
  
  // Roofing
  if (name.match(/roof|gutter/)) {
    return "Roofing";
  }
  
  // General Contractors
  if (name.match(/contract|construct|remodel|renovat|handyman/)) {
    return "General Contractor";
  }
  
  // Dental
  if (name.match(/dent|ortho|oral|smile/)) {
    return "Dental";
  }
  
  // Medical
  if (name.match(/medical|clinic|physician|doctor|health|care\s*center/)) {
    return "Medical";
  }
  
  // Carpet/Flooring
  if (name.match(/carpet|floor|tile/)) {
    return "Flooring";
  }
  
  // Pest Control
  if (name.match(/pest|exterminator|termite/)) {
    return "Pest Control";
  }
  
  // Landscaping
  if (name.match(/landscape|lawn|tree\s*service|yard/)) {
    return "Landscaping";
  }
  
  // Default
  return "Home Services";
}
