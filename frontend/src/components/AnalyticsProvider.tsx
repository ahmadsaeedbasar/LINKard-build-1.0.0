"use client";

import React, { useEffect, useRef } from 'react';
import AnalyticsContext, { AnalyticsContextType } from '../context/AnalyticsContext';

const getSessionId = () => {
  let sid = sessionStorage.getItem('analytics_sid');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('analytics_sid', sid);
  }
  return sid;
};

const SESSION_ID = getSessionId();

const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sendEvent: AnalyticsContextType['sendEvent'] = (endpoint, payload) => {
    const ownerId = document.body.dataset.profileOwnerId;
    if (ownerId) payload.profile_owner_id = ownerId;

    payload.session_id = SESSION_ID;
    payload.page_url = window.location.href;

    fetch(endpoint, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error("Analytics Error:", err));
  };

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Initialize IntersectionObserver for impressions
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          if (!el.dataset.impressed) {
            el.dataset.impressed = "true";
            sendEvent('/api/a/s1/', {
              social_account_id: el.dataset.socialId,
              event_type: 'impression'
            });
          }
        }
      });
    }, { threshold: 0.5 });

    // Observe existing elements on mount
    document.querySelectorAll('[data-track-impression]').forEach(el => {
      observer.current?.observe(el);
    });

    // MutationObserver to observe dynamically added elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && (node as HTMLElement).matches('[data-track-impression]')) {
            observer.current?.observe(node as HTMLElement);
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.current?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <AnalyticsContext.Provider value={{ sendEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;