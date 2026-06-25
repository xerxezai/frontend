import ContactFormSection from "../forms/ContactFormSection";

const ContactSection2 = () => {
  return (
    <section style={{ background: '#F2EFE9', padding: '100px 0' }}>
      <div className="container">
        <div className="row g-4 align-items-start">
          {/* Left — dark editorial card */}
          <div className="col-lg-5">
            <div style={{
              background: '#1C1C1E', borderRadius: 20, padding: '40px 36px',
              position: 'relative', overflow: 'hidden',
              boxShadow: '-16px 16px 60px rgba(0,0,0,0.2)',
            }}>
              <div style={{
                position: 'absolute', width: 200, height: 200, borderRadius: '50%',
                background: 'rgba(108,87,210,0.2)', filter: 'blur(50px)',
                bottom: -60, right: -40, pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 900,
                  fontSize: 'clamp(24px, 3vw, 36px)', color: '#ffffff',
                  letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
                }}>
                  Let's build<br />
                  <span style={{ color: '#6c57d2', fontStyle: 'italic' }}>something great.</span>
                </h2>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 28,
                }}>
                  Reach out and our enterprise architects will respond within 24 hours.
                </p>

                {[
                  { icon: 'fas fa-phone-alt',    label: 'Phone',   value: '+971 56 786 7451' },
                  { icon: 'fas fa-envelope',     label: 'Email',   value: 'info@xerxez.com' },
                  { icon: 'fas fa-globe',        label: 'Website', value: 'xerxez.com' },
                  { icon: 'fas fa-map-marker-alt', label: 'HQ',   value: 'India & UAE — Remote-first' },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: '#6c57d2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <i className={icon} style={{ color: '#fff', fontSize: 13 }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                    </div>
                  </div>
                ))}

                <div style={{
                  marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: 8, flexWrap: 'wrap',
                }}>
                  {['ISO 27001', 'SOC 2 Type II', '24h Response', '15+ Countries'].map(tag => (
                    <span key={tag} style={{
                      background: 'rgba(108,87,210,0.12)',
                      border: '1px solid rgba(108,87,210,0.2)',
                      borderRadius: 100, padding: '4px 12px',
                      fontSize: 10, color: 'rgba(255,255,255,0.5)',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="col-lg-7">
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#6c57d2',
                fontFamily: "'DM Sans', sans-serif", marginBottom: 8,
              }}>
                Contact Us
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 900,
                fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#1A1A1A',
                letterSpacing: '-0.02em', lineHeight: 1.1,
              }}>
                Let Us Take Your Product<br />
                <span style={{ fontStyle: 'italic', color: '#6c57d2' }}>To The Next Level</span>
              </h2>
            </div>
            <ContactFormSection variant />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection2;
