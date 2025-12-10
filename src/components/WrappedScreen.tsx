import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import type { AllActivitiesStats, StepsStats } from '../types';

type AspectRatio = 'square' | 'story' | 'landscape';

interface WrappedScreenProps {
  activitiesStats: AllActivitiesStats | null;
  stepsStats: StepsStats | null;
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
}

const WrappedScreen: React.FC<WrappedScreenProps> = ({
  activitiesStats,
  stepsStats,
  selectedRatio,
  onRatioChange,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Calculate total number of slides
  const totalSlides = React.useMemo(() => {
    let count = 0;
    if (activitiesStats) {
      // Intro + Total Distance + Top Activity + Top 3 activities + Best Month + Streak + Outro
      count += 3 + Math.min(activitiesStats.activitiesByType.length, 3) + 3;
    }
    if (stepsStats) {
      // Intro + Total Steps + Average + Best Week + Best Month
      count += 5;
    }
    return count;
  }, [activitiesStats, stepsStats]);

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [activitiesStats, stepsStats]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex]);

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const captureSlide = async () => {
    const captureArea = document.getElementById('capture-area');
    if (!captureArea) return;

    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.style.opacity = '0.5';
      shareBtn.style.pointerEvents = 'none';
    }

    try {
      const dimensions = getDimensionsForRatio(selectedRatio);
      const canvas = await html2canvas(captureArea, {
        width: dimensions.width,
        height: dimensions.height,
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `garmin-wrapped-slide-${currentSlideIndex + 1}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Capture failed:', error);
      alert('Failed to capture slide. Please try again.');
    } finally {
      if (shareBtn) {
        shareBtn.style.opacity = '1';
        shareBtn.style.pointerEvents = 'auto';
      }
    }
  };

  const getDimensionsForRatio = (ratio: AspectRatio): { width: number; height: number } => {
    switch (ratio) {
      case 'square':
        return { width: 1080, height: 1080 };
      case 'story':
        return { width: 1080, height: 1920 };
      case 'landscape':
        return { width: 1920, height: 1080 };
      default:
        return { width: 1080, height: 1080 };
    }
  };

  const renderProgressDots = () => {
    return (
      <div id="progress-dots">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlideIndex ? 'active' : ''}`}
            onClick={() => setCurrentSlideIndex(index)}
          />
        ))}
      </div>
    );
  };

  const renderSlide = () => {
    let slideIndex = 0;

    // Activity slides
    if (activitiesStats) {
      if (slideIndex === currentSlideIndex) {
        const activityList = activitiesStats.activitiesByType
          .map(a => a.type)
          .join(', ')
          .replace(/, ([^,]*)$/, ' & $1');
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Your {activitiesStats.year}</div>
            <div className="stat-value" style={{ fontSize: '3.5rem', margin: '3rem 0' }}>
              Fitness Wrapped
            </div>
            <p style={{ fontSize: '1.5rem' }}>{activityList}</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        const totalKm = activitiesStats.totalDistance.toFixed(1);
        const marathons = (activitiesStats.totalDistance / 42.195).toFixed(1);
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">You covered</div>
            <div className="stat-value">{totalKm}</div>
            <div className="stat-label">kilometers</div>
            <p>That's equivalent to {marathons} marathons!</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        const topActivity = activitiesStats.activitiesByType[0];
        const percentage = topActivity.percentage.toFixed(0);
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Your top activity</div>
            <div className="stat-value" style={{ fontSize: '4rem' }}>
              {topActivity.type}
            </div>
            <div className="stat-label">{topActivity.totalDistance.toFixed(1)} km</div>
            <p>{percentage}% of your total distance</p>
          </div>
        );
      }
      slideIndex++;

      // Individual activity slides
      for (let i = 0; i < Math.min(activitiesStats.activitiesByType.length, 3); i++) {
        const activity = activitiesStats.activitiesByType[i];
        if (slideIndex === currentSlideIndex) {
          const bestMonth = activity.bestMonth.month.split(' ')[0];
          return (
            <div className="story-slide">
              <div className="slide-header">Garmin (un)Wrapped</div>
              <div className="slide-title">{activity.type}</div>
              <div className="stat-value">{activity.totalDistance.toFixed(1)}</div>
              <div className="stat-label">kilometers in {activity.totalMonths} months</div>
              <p>
                Best month: {bestMonth} ({activity.bestMonth.distance.toFixed(1)} km)
              </p>
            </div>
          );
        }
        slideIndex++;
      }

      if (slideIndex === currentSlideIndex) {
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Your best month</div>
            <div className="stat-value" style={{ fontSize: '4rem' }}>
              {activitiesStats.milestones.bestMonth.month}
            </div>
            <div className="stat-label">{activitiesStats.milestones.bestMonth.distance.toFixed(1)} km</div>
            <p>You were unstoppable!</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Your longest streak</div>
            <div className="stat-value">{activitiesStats.milestones.bestStreak}</div>
            <div className="stat-label">consecutive months</div>
            <p>That's dedication!</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">{activitiesStats.year} in numbers</div>
            <p style={{ fontSize: '1.5rem', margin: '2rem 0', lineHeight: 1.8 }}>
              {activitiesStats.activitiesByType.map((a, i) => (
                <React.Fragment key={i}>
                  {a.totalDistance.toFixed(1)} km {a.type.toLowerCase()}
                  {i < activitiesStats.activitiesByType.length - 1 && <br />}
                </React.Fragment>
              ))}
              <br />
              <br />
              {activitiesStats.totalMonths} months active
              <br />
              {activitiesStats.milestones.bestStreak} month streak
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '3rem' }}>
              Here's to moving even more in {activitiesStats.year + 1}
            </p>
          </div>
        );
      }
      slideIndex++;
    }

    // Steps slides
    if (stepsStats) {
      if (slideIndex === currentSlideIndex) {
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Your {stepsStats.year}</div>
            <div className="stat-value" style={{ fontSize: '3.5rem', margin: '3rem 0' }}>
              Step Count
            </div>
            <p style={{ fontSize: '1.5rem' }}>Let's see how far you walked</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        const totalSteps = stepsStats.totalSteps.toLocaleString();
        const distanceKm = ((stepsStats.totalSteps * 0.762) / 1000).toFixed(1);
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">You walked</div>
            <div className="stat-value">{totalSteps}</div>
            <div className="stat-label">steps</div>
            <p>That's about {distanceKm} km!</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        const avgSteps = stepsStats.averageStepsPerDay.toLocaleString();
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Daily average</div>
            <div className="stat-value">{avgSteps}</div>
            <div className="stat-label">steps per day</div>
            <p>Keep moving forward!</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        const bestSteps = stepsStats.bestWeek.steps.toLocaleString();
        const weekDate = new Date(stepsStats.bestWeek.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Your best week</div>
            <div className="stat-value">{bestSteps}</div>
            <div className="stat-label">steps (week of {weekDate})</div>
            <p>You were on fire!</p>
          </div>
        );
      }
      slideIndex++;

      if (slideIndex === currentSlideIndex) {
        const bestSteps = stepsStats.bestMonth.steps.toLocaleString();
        return (
          <div className="story-slide">
            <div className="slide-header">Garmin (un)Wrapped</div>
            <div className="slide-title">Your best month</div>
            <div className="stat-value" style={{ fontSize: '4rem' }}>
              {stepsStats.bestMonth.month}
            </div>
            <div className="stat-label">{bestSteps} steps</div>
            <p>Incredible consistency!</p>
          </div>
        );
      }
      slideIndex++;
    }

    return <div>No data available</div>;
  };

  console.log('WrappedScreen render:', { activitiesStats, stepsStats, totalSlides, currentSlideIndex });

  if (totalSlides === 0) {
    return (
      <div style={{ color: 'white', padding: '2rem', background: 'red' }}>
        <h2>No data available</h2>
        <p>Activities: {activitiesStats ? 'Yes' : 'No'}</p>
        <p>Steps: {stepsStats ? 'Yes' : 'No'}</p>
      </div>
    );
  }

  // Render the current slide based on index
  const renderCurrentSlide = () => {
    let slideNum = 0;

    // Activities intro
    if (activitiesStats && slideNum === currentSlideIndex) {
      const activityList = activitiesStats.activitiesByType.map(a => a.type).join(', ').replace(/, ([^,]*)$/, ' & $1');
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Your {activitiesStats.year}</div>
          <div className="stat-value" style={{ fontSize: '3.5rem', margin: '3rem 0' }}>Fitness Wrapped</div>
          <p style={{ fontSize: '1.5rem' }}>{activityList}</p>
        </div>
      );
    }
    if (activitiesStats) slideNum++;

    // Total distance
    if (activitiesStats && slideNum === currentSlideIndex) {
      const totalKm = activitiesStats.totalDistance.toFixed(1);
      const marathons = (activitiesStats.totalDistance / 42.195).toFixed(1);
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">You covered</div>
          <div className="stat-value">{totalKm}</div>
          <div className="stat-label">kilometers</div>
          <p>That's equivalent to {marathons} marathons!</p>
        </div>
      );
    }
    if (activitiesStats) slideNum++;

    // Top activity
    if (activitiesStats && slideNum === currentSlideIndex) {
      const topActivity = activitiesStats.activitiesByType[0];
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Your top activity</div>
          <div className="stat-value" style={{ fontSize: '4rem' }}>{topActivity.type}</div>
          <div className="stat-label">{topActivity.totalDistance.toFixed(1)} km</div>
          <p>{topActivity.percentage.toFixed(0)}% of your total distance</p>
        </div>
      );
    }
    if (activitiesStats) slideNum++;

    // Individual activities
    if (activitiesStats) {
      for (let i = 0; i < Math.min(activitiesStats.activitiesByType.length, 3); i++) {
        const activity = activitiesStats.activitiesByType[i];
        if (slideNum === currentSlideIndex) {
          const bestMonth = activity.bestMonth.month.split(' ')[0];
          return (
            <div className="story-slide active">
              <div className="slide-header">Garmin (un)Wrapped</div>
              <div className="slide-title">{activity.type}</div>
              <div className="stat-value">{activity.totalDistance.toFixed(1)}</div>
              <div className="stat-label">kilometers in {activity.totalMonths} months</div>
              <p>Best month: {bestMonth} ({activity.bestMonth.distance.toFixed(1)} km)</p>
            </div>
          );
        }
        slideNum++;
      }
    }

    // Best month
    if (activitiesStats && slideNum === currentSlideIndex) {
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Your best month</div>
          <div className="stat-value" style={{ fontSize: '4rem' }}>{activitiesStats.milestones.bestMonth.month}</div>
          <div className="stat-label">{activitiesStats.milestones.bestMonth.distance.toFixed(1)} km</div>
          <p>You were unstoppable!</p>
        </div>
      );
    }
    if (activitiesStats) slideNum++;

    // Streak
    if (activitiesStats && slideNum === currentSlideIndex) {
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Your longest streak</div>
          <div className="stat-value">{activitiesStats.milestones.bestStreak}</div>
          <div className="stat-label">consecutive months</div>
          <p>That's dedication!</p>
        </div>
      );
    }
    if (activitiesStats) slideNum++;

    // Outro
    if (activitiesStats && slideNum === currentSlideIndex) {
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">{activitiesStats.year} in numbers</div>
          <p style={{ fontSize: '1.5rem', margin: '2rem 0', lineHeight: 1.8 }}>
            {activitiesStats.activitiesByType.map((a, i) => (
              <React.Fragment key={i}>
                {a.totalDistance.toFixed(1)} km {a.type.toLowerCase()}
                {i < activitiesStats.activitiesByType.length - 1 && <br />}
              </React.Fragment>
            ))}
            <br /><br />
            {activitiesStats.totalMonths} months active<br />
            {activitiesStats.milestones.bestStreak} month streak
          </p>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '3rem' }}>
            Here's to moving even more in {activitiesStats.year + 1}
          </p>
        </div>
      );
    }

    // Steps intro
    if (stepsStats && slideNum === currentSlideIndex) {
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Your {stepsStats.year}</div>
          <div className="stat-value" style={{ fontSize: '3.5rem', margin: '3rem 0' }}>Step Count</div>
          <p style={{ fontSize: '1.5rem' }}>Let's see how far you walked</p>
        </div>
      );
    }
    if (stepsStats) slideNum++;

    // Steps total
    if (stepsStats && slideNum === currentSlideIndex) {
      const totalSteps = stepsStats.totalSteps.toLocaleString();
      const distanceKm = ((stepsStats.totalSteps * 0.762) / 1000).toFixed(1);
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">You walked</div>
          <div className="stat-value">{totalSteps}</div>
          <div className="stat-label">steps</div>
          <p>That's about {distanceKm} km!</p>
        </div>
      );
    }
    if (stepsStats) slideNum++;

    // Steps average
    if (stepsStats && slideNum === currentSlideIndex) {
      const avgSteps = stepsStats.averageStepsPerDay.toLocaleString();
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Daily average</div>
          <div className="stat-value">{avgSteps}</div>
          <div className="stat-label">steps per day</div>
          <p>Keep moving forward!</p>
        </div>
      );
    }
    if (stepsStats) slideNum++;

    // Best week
    if (stepsStats && slideNum === currentSlideIndex) {
      const bestSteps = stepsStats.bestWeek.steps.toLocaleString();
      const weekDate = new Date(stepsStats.bestWeek.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Your best week</div>
          <div className="stat-value">{bestSteps}</div>
          <div className="stat-label">steps (week of {weekDate})</div>
          <p>You were on fire!</p>
        </div>
      );
    }
    if (stepsStats) slideNum++;

    // Best month
    if (stepsStats && slideNum === currentSlideIndex) {
      const bestSteps = stepsStats.bestMonth.steps.toLocaleString();
      return (
        <div className="story-slide active">
          <div className="slide-header">Garmin (un)Wrapped</div>
          <div className="slide-title">Your best month</div>
          <div className="stat-value" style={{ fontSize: '4rem' }}>{stepsStats.bestMonth.month}</div>
          <div className="stat-label">{bestSteps} steps</div>
          <p>Incredible consistency!</p>
        </div>
      );
    }

    return <div style={{ color: 'white', padding: '2rem' }}>No slide found</div>;
  };

  return (
    <div id="capture-area" className="capture-area">
      <div id="story-container">
        {renderCurrentSlide()}
      </div>

      <div className="share-controls">
        <button id="share-btn" className="share-btn" onClick={captureSlide} title="Share this slide">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <div className="ratio-selector">
          <button
            className={`ratio-btn ${selectedRatio === 'square' ? 'active' : ''}`}
            onClick={() => onRatioChange('square')}
            title="1:1 (Instagram Post)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
            <span>1:1</span>
          </button>
          <button
            className={`ratio-btn ${selectedRatio === 'story' ? 'active' : ''}`}
            onClick={() => onRatioChange('story')}
            title="9:16 (Instagram/TikTok Story)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="7" y="2" width="10" height="20" rx="2" />
            </svg>
            <span>9:16</span>
          </button>
          <button
            className={`ratio-btn ${selectedRatio === 'landscape' ? 'active' : ''}`}
            onClick={() => onRatioChange('landscape')}
            title="16:9 (Twitter/LinkedIn)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="7" width="20" height="10" rx="2" />
            </svg>
            <span>16:9</span>
          </button>
        </div>
      </div>

      <div className="navigation">
        <button
          className="nav-btn"
          onClick={prevSlide}
          disabled={currentSlideIndex === 0}
        >
          ←
        </button>
        {renderProgressDots()}
        <button
          className="nav-btn"
          onClick={nextSlide}
          disabled={currentSlideIndex === totalSlides - 1}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default WrappedScreen;
