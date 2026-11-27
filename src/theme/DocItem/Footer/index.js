import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import WikiFeedback from '@site/src/components/WikiFeedback';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <WikiFeedback />
    </>
  );
}
