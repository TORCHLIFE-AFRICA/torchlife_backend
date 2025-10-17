import { Img, Section } from '@react-email/components';

const logoContainer = {
    marginTop: '32px',
};

function Logo() {
    return (
        <Section style={logoContainer}>
            <Img src={`https://www.torchlife.africa/logo.svg`} width="64" height="64" alt="TorchLife logo" />
        </Section>
    );
}

export default Logo;
