import { Img, Section } from "@react-email/components";

const logoContainer = {
  marginTop: "32px",
};

function Logo() {
  return (
    <Section style={logoContainer}>
      <Img src={`https://www.1159realty.com/black-logo.jpeg`} width="64" height="64" alt="1159Realty logo" />
    </Section>
  );
}

export default Logo;
