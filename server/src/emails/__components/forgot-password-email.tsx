import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ForgotPasswordEmailProps = {
  url: string;
  name?: string;
};

export default function ForgotPasswordEmail({
  url,
  name = "there",
}: ForgotPasswordEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your Careerly password</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            {/* Brand */}
            <Text style={brand}>Careerly</Text>

            <Heading style={heading}>Reset your password</Heading>

            <Text style={text}>
              Hi <span style={highlight}>{name}</span>,
            </Text>

            <Text style={text}>
              We received a request to reset your <strong>Careerly</strong>{" "}
              account password. Click the button below to set a new password.
            </Text>

            <Section style={buttonContainer}>
              <Button href={url} style={button}>
                Reset Password
              </Button>
            </Section>

            <Text style={muted}>
              ⏳ This password reset link will expire in{" "}
              <strong>24 hours</strong>.
            </Text>

            <Text style={muted}>
              If you didn’t request a password reset, you can safely ignore this
              email.
            </Text>

            <Hr style={hr} />

            <Text style={footerText}>
              If the button doesn’t work, copy and paste this link into your
              browser:
            </Text>

            <Text style={link}>{url}</Text>

            <Text style={copyright}>
              © {new Date().getFullYear()} Careerly. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ------------------ Styles ------------------ */

const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  padding: "48px 0",
};

const card = {
  maxWidth: "480px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "36px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
};

const brand = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#0a66c2",
  textAlign: "center" as const,
  marginBottom: "12px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const text = {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "24px",
  marginBottom: "12px",
};

const highlight = {
  fontWeight: "600",
  color: "#0a66c2",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "28px 0",
};

const button = {
  backgroundColor: "#0a66c2",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "25px",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(79,70,229,0.35)",
};

const muted = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "8px",
};

const hr = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "28px 0",
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "6px",
};

const link = {
  fontSize: "14px",
  color: "#0a66c2",
  wordBreak: "break-all" as const,
};

const copyright = {
  marginTop: "20px",
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center" as const,
};
