import { Img, Row, Column, Link } from '@react-email/components';

const styles = {
    mainWrapper: { textAlign: 'center' as any, marginTop: '30px', backgroundColor: '#f3f3f3' },
    fullWidth: { width: '100%' },
    text: {
        fontSize: '16px',
        lineHeight: '28px',
        color: 'grey',
    },
    copyright: {
        fontSize: '16px',
        lineHeight: '28px',
        color: '#404040',
        marginTop: '10px',
    },
};

const baseUrl = 'https://www.torchlife.africa/';

function Footer() {
    return (
        <div style={styles.mainWrapper}>
            <table style={styles.fullWidth}>
                <tr>
                    <td align="center">
                        <div style={styles.text}>Lagos, Nigeria.</div>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <div style={styles.text}>
                            1st floor, Gods Heritage building, Adekunle Fajuyi Rd, mokola, Ibadan.
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <div style={styles.text}>admin@torchlife.africa. +234 806 174 7003</div>
                    </td>
                </tr>
                <tr style={styles.fullWidth}>
                    <td align="center">
                        <div style={styles.copyright}>
                            © {new Date().getFullYear()} TorchLife. All rights reserved.
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <Row
                            style={{
                                height: 44,
                                width: 56,
                                verticalAlign: 'bottom',
                            }}
                        >
                            <Column style={{ paddingRight: 8 }}>
                                <Link href="https://www.instagram.com/torchlife/?hl=en">
                                    <Img
                                        alt="Instagram1"
                                        width="25"
                                        height="25"
                                        src={`${baseUrl}/instagram-logo.png`}
                                    />
                                </Link>
                            </Column>
                            <Column style={{ paddingRight: 8 }}>
                                <Link href="https://www.instagram.com/torchlife/?hl=en">
                                    <Img
                                        alt="Instagram2"
                                        width="25"
                                        height="25"
                                        src={`${baseUrl}/instagram-logo.png`}
                                    />
                                </Link>
                            </Column>
                            {/* <Column style={{ paddingRight: 8 }}>
                <Link href="https://www.linkedin.com/company/torchlife.africa/">
                  <Img alt="Linkedin" width="25" height="25" src={`${baseUrl}/linkedin-logo.png`} />
                </Link>
              </Column>
              <Column style={{ paddingRight: 8 }}>
                <Link href="https://wa.me">
                  <Img alt="Whatsapp" height="25" src={`${baseUrl}/whatsapp-logo.png`} width="25" />
                </Link>
              </Column> */}
                        </Row>
                    </td>
                </tr>
            </table>
        </div>
    );
}

export default Footer;
