import { Body, Container, Head, Html, Preview, Tailwind } from '@react-email/components';
import Logo from './logo';
import { nameLarge, nameRegular } from '../utils/styles';
import Footer from './footer';

interface Props {
    children: React.ReactNode;
    preview: string;
    firstName?: string;
    isLargeName?: boolean;
    hideFooter?: boolean;
    header?: string;
}

const main = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};
const container = {
    margin: '0 auto',
    padding: '0px 20px',
};

const heading = {
    fontWeight: 600,
    fontSize: '20px',
    marginTop: '30px',
    marginBottom: '-10px',
};

export const Layout = ({ children, firstName, isLargeName, preview, hideFooter, header }: Props) => {
    return (
        <Html>
            <Head />
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: '#2250f4',
                                offwhite: '#fafbfb',
                            },
                            spacing: {
                                0: '0px',
                                20: '20px',
                                45: '45px',
                            },
                        },
                    },
                }}
            >
                <Preview>{preview}</Preview>
                <div style={main}>
                    <Container style={container}>
                        <Logo />

                        {Boolean(preview?.trim()) && <div style={heading}>{preview}</div>}

                        <div style={isLargeName ? nameLarge : nameRegular}>
                            {Boolean(firstName?.trim()) && `Hello ${firstName},`}
                        </div>

                        {children}
                    </Container>

                    <Footer />
                </div>
            </Tailwind>
        </Html>
    );
};

export default Layout;
