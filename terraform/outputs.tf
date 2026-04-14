output "d1_database_name" {
  value = cloudflare_d1_database.main.name
}

output "d1_database_id" {
  value = cloudflare_d1_database.main.id
}

output "r2_bucket_name" {
  value = cloudflare_r2_bucket.images.name
}

