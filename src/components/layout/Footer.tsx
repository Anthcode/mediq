import React from "react";
import styled from "styled-components";
import { Container } from "../common/Container";
import { theme } from "../../styles/theme";

const FooterContainer = styled.footer`
  background-color: ${theme.colors.background.paper};
  padding: ${theme.spacing(4)} 0;
  margin-top: auto;
  border-top: 1px solid ${theme.colors.neutral.light};
  min-height: 60px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  margin-top: ${theme.spacing(4)};
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 0.7rem;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${theme.colors.text.primary};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    margin-top: 0;
  }
`;

const FooterLink = styled.a`
  margin: 0 ${theme.spacing(2)};
  color: ${theme.colors.text.secondary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container $maxWidth="lg">
        <FooterContent>
          <FooterLogo>
            <LogoText>MedIQ</LogoText>
          </FooterLogo>
          
          <FooterLinks>
            <FooterLink href="/about">O nas</FooterLink>
            <FooterLink href="/privacy">Polityka prywatności</FooterLink>
            <FooterLink href="/terms">Regulamin</FooterLink>
            <FooterLink href="/contact">Kontakt</FooterLink>
          </FooterLinks>
          
          <Copyright>
            © {new Date().getFullYear()} MedIQ. Wszystkie prawa zastrzeżone.
          </Copyright>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
