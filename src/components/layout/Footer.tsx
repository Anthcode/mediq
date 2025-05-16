import React from "react";
import styled from "styled-components";
import { Container } from "../common/Container";
import { theme } from "../../styles/theme";

const FooterContainer = styled.footer`
  background: linear-gradient(to right, ${theme.colors.background.paper}, ${theme.colors.background.default});
  padding: ${theme.spacing(2)} 0;
  margin-top: auto;
  border-top: 1px solid ${theme.colors.neutral.light};
  min-height: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.03);
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
  margin: 0;
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.7;
  letter-spacing: 0.1px;
  display: flex;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: ${theme.spacing(2)};
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  letter-spacing: -0.3px;
  background: linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.9;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${theme.spacing(2)};

  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    margin-top: 0;
  }
`;

const FooterLink = styled.a`
  margin: 0 ${theme.spacing(1.5)};
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  position: relative;
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  transition: color 0.2s ease-in-out;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background: linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main});
    transition: all 0.3s ease-in-out;
    transform: translateX(-50%);
  }

  &:hover {
    color: ${theme.colors.primary.main};
    text-decoration: none;

    &:after {
      width: 80%;
    }
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
