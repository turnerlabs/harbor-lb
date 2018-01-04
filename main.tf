provider "aws" {
  profile = "aws-shared-services:aws-shared-services-admin"
}

terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "tf-state-harbor-lb"
    key    = "terraform.tfstate"
  }
}

variable "app" {
  default = "lb.harbor.turnerlabs.io"
}

variable "tags" {
  type = "map"

  default = {
    team          = "cloudarch"
    application   = "lb.harbor.turnerlabs.io"
    environment   = "prod"
    contact-email = "john.ritsema@turner.com"
    customer      = "cloudarch"
  }
}

# s3 bucket with http serving enabled
resource "aws_s3_bucket" "main" {
  bucket = "${var.app}"
  tags   = "${var.tags}"

  website {
    index_document = "index.html"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_policy" "main" {
  bucket = "${aws_s3_bucket.main.id}"
  policy = "${data.aws_iam_policy_document.s3.json}"
}

data "aws_iam_policy_document" "s3" {
  statement {
    sid = "write"

    principals {
      type = "AWS"

      identifiers = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:assumed-role/aws-shared-services-admin/John.Ritsema@turner.com",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:assumed-role/aws-shared-services-admin/Jason.Tolsma@turner.com",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:assumed-role/aws-shared-services-admin/Wilson.Wise@turner.com",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:assumed-role/aws-shared-services-admin/James.Hodnett@turner.com",
      ]
    }

    actions = ["s3:*"]

    resources = [
      "${aws_s3_bucket.main.arn}",
      "${aws_s3_bucket.main.arn}/*",
    ]
  }

  statement {
    sid    = "read"
    effect = "Allow"

    principals = {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = ["s3:GetObject"]

    resources = [
      "${aws_s3_bucket.main.arn}",
      "${aws_s3_bucket.main.arn}/*",
    ]
  }
}

# route53 cname to s3 (lb.harbor.turnerlabs.io)
data "aws_route53_zone" "app" {
  name = "turnerlabs.io."
}

resource "aws_route53_record" "record" {
  zone_id = "${data.aws_route53_zone.app.zone_id}"
  type    = "CNAME"
  name    = "${var.app}"
  records = ["${aws_s3_bucket.main.website_endpoint}"]
  ttl     = "30"
}
