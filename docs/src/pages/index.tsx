import React, { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('container', animateIn ? styles.fadeIn : '')}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
              {siteConfig.title}
            </Heading>
            <p className={clsx('hero__subtitle', styles.heroSubtitle)}>{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className={clsx('button button--secondary button--lg', styles.buttonGetStarted)}
                to="/docs/presentation">
                Get Started
              </Link>
              <Link
                className={clsx('button button--outline button--lg', styles.buttonGithub)}
                to="https://github.com/germainlefebvre4/S3Streamer"
                target="_blank" rel="noopener noreferrer">
                <span className={styles.githubIcon}>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </span>
                GitHub
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.videoPreviewContainer}>
              <div className={styles.videoPlayerMockup}>
                <div className={styles.videoControls}>
                  <div className={styles.videoControlCircle}></div>
                  <div className={styles.videoControlCircle}></div>
                  <div className={styles.videoControlCircle}></div>
                </div>
                <div className={styles.videoScreen}>
                  <div className={styles.videoScreenContent}>
                    <div className={styles.videoPlayButton}>
                      <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomepageDemo() {
  return (
    <section className={styles.demoSection}>
      <div className="container">
        <div className={styles.demoContainer}>
          <div className={styles.demoContent}>
            <Heading as="h2" className={styles.demoTitle}>
              Simple and Powerful
            </Heading>
            <p className={styles.demoText}>
              S3 Streamer makes it easy to stream videos from any S3-compatible storage.
              Just set up your credentials, point to your bucket, and start streaming
              your videos in a beautiful, responsive interface.
            </p>
            <div className={styles.demoPoints}>
              <div className={styles.demoPoint}>
                <div className={styles.demoPointIcon}>✓</div>
                <div className={styles.demoPointText}>Works with any S3-compatible storage</div>
              </div>
              <div className={styles.demoPoint}>
                <div className={styles.demoPointIcon}>✓</div>
                <div className={styles.demoPointText}>Secure pre-signed URLs</div>
              </div>
              <div className={styles.demoPoint}>
                <div className={styles.demoPointIcon}>✓</div>
                <div className={styles.demoPointText}>Responsive design for all devices</div>
              </div>
            </div>
          </div>
            <div className={styles.demoCodeContainer}>
              <div 
                className={clsx(styles.demoPreview)} 
              ></div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Video Streaming from S3-Compatible Storage`}
      description="S3 Streamer is a Node.js application that allows you to stream videos from any S3-compatible storage bucket directly in your browser.">
      <HomepageHeader />
      <main>
        <HomepageDemo />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
