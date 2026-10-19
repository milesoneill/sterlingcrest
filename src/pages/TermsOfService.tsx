import { Link } from "react-router-dom";
import { contactEmail, contactPhone } from "@/lib/contact";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-primary hover:text-primary/80 text-sm font-sans tracking-widest uppercase transition-colors">
          ← Back to Home
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-8 mb-4">Terms of Service</h1>
        <p className="text-muted-foreground text-sm font-sans mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose max-w-none space-y-8 text-foreground/85 font-sans leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>This website is operated by O'Neill Capital Inc. (DBA Sterling Crest Financial) ("Company," "we," "our," or "us"). By accessing or using our website and services, you ("you" or "User") agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our website or services.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">2. Description of Services</h2>
            <p>O'Neill Capital Inc., doing business as Sterling Crest Financial, is a commercial insurance brokerage that provides insurance consulting, risk assessment, and policy placement services. Our website serves as an informational resource and lead capture platform to connect businesses with our insurance professionals.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">3. Use of Website</h2>
            <p>You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Transmit any harmful, threatening, or objectionable content</li>
              <li>Use automated systems to scrape or extract data from our website</li>
              <li>Interfere with or disrupt the website or its infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">4. Communications and Consent</h2>
            <p>When you request a consultation, O'Neill Capital Inc. (DBA Sterling Crest Financial) may contact you to fulfill that request. Providing contact information, submitting a form, or using our chat widget does not by itself provide SMS marketing or service-text consent.</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Phone Calls:</strong> When you book a phone consultation, we will call you at the number provided for that consultation.</li>
              <li><strong className="text-foreground">SMS/Text Messages:</strong> Our booking form offers separate, optional, unchecked choices for service texts about your consultation, appointment reminders, and policy-related support, and marketing texts about insurance products and offers, including automated texts. Selecting one does not select the other. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.</li>
              <li><strong className="text-foreground">Emails:</strong> If you provide an email address, we may send your calendar invitation and respond to your requested consultation.</li>
            </ul>
            <p className="mt-3">SMS consent is not a condition of purchase or booking. You can book without selecting either SMS checkbox. Mobile information and SMS opt-in consent will not be shared with third parties or affiliates for their marketing or promotional purposes. You may revoke consent by replying STOP or contacting us.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">5. No Insurance Advice</h2>
            <p>The information provided on this website is for general informational purposes only and does not constitute insurance advice, a quote, or an offer of coverage. Actual coverage is subject to the terms, conditions, and exclusions of each individual policy. Please consult directly with one of our licensed professionals for advice tailored to your specific situation.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">6. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, images, and software, is the property of O'Neill Capital Inc. (DBA Sterling Crest Financial) or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">7. Disclaimer of Warranties</h2>
            <p>Our website and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">8. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, O'Neill Capital Inc. (DBA Sterling Crest Financial) shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our website or services, regardless of the theory of liability.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">9. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless O'Neill Capital Inc. (DBA Sterling Crest Financial), its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the website or violation of these Terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">10. Third-Party Services</h2>
            <p>Our website may integrate with third-party services, including chat widgets, analytics tools, and communication platforms. Your use of these third-party services is subject to their respective terms and privacy policies. We are not responsible for the practices of third-party service providers.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">11. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the state in which O'Neill Capital Inc. operates, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">12. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">13. Contact Us</h2>
            <p>If you have questions about these Terms of Service, please contact us:</p>
            <div className="mt-3 p-6 bg-muted rounded-lg border border-border/60">
              <p className="font-serif text-lg text-foreground">O'Neill Capital Inc.</p>
              <p className="text-muted-foreground text-sm mt-1">DBA Sterling Crest Financial</p>
              <p className="mt-3">Email: {contactEmail}</p>
              <p>Phone: {contactPhone}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
