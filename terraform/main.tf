terraform {
  required_version = ">= 1.6.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_d1_database" "main" {
  account_id = var.account_id
  name       = var.project_name
}

resource "cloudflare_r2_bucket" "images" {
  account_id = var.account_id
  name       = "${var.project_name}-images"
  location   = var.r2_location
}
