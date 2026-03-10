import { Link } from "@react-email/components";

const button = {
  backgroundColor: "#E0CB53",
  borderRadius: "4px",
  color: "#000",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

interface Props {
  href: string;
  children: React.ReactNode;
}

function ButtonLink({ href, children }: Props) {
  return (
    <Link style={button} href={href}>
      {children}
    </Link>
  );
}

export default ButtonLink;
