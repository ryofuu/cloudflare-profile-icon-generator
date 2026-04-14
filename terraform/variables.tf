variable "account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token used by Terraform."
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Base name for provisioned resources."
  type        = string
  default     = "cloudflare-profile-icon"
}

variable "r2_location" {
  description = "Location hint for the R2 bucket."
  type        = string
  default     = "ENAM"
}

