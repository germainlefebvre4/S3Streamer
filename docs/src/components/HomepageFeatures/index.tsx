import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy Video Streaming',
    Svg: require('@site/static/img/screen_player.svg').default,
    description: (
      <>
        Stream videos directly from any S3-compatible storage with ease.
        No complex setup required - just configure your bucket and start streaming.
      </>
    ),
  },
  {
    title: 'Pre-signed URL Security',
    Svg: require('@site/static/img/cloud-lock.svg').default,
    description: (
      <>
        S3 Streamer generates secure pre-signed URLs with expiration times,
        ensuring your content is protected while still being easily accessible.
      </>
    ),
  },
  {
    title: 'Responsive Interface',
    Svg: require('@site/static/img/screen_responsive.svg').default,
    description: (
      <>
        Enjoy a clean, modern web interface that works flawlessly on both desktop
        and mobile devices, making your video library accessible from anywhere.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
