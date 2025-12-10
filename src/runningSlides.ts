import type { RunningStats } from './types';

export function createRunningSlides(stats: RunningStats): HTMLElement[] {
  return [
    createIntroSlide(stats),
    createTotalDistanceSlide(stats),
    createBestMonthSlide(stats),
    createConsistencySlide(stats),
    createAverageSlide(stats),
    // createStreakSlide(stats),
    createOutroSlide(stats),
  ];
}

function createIntroSlide(stats: RunningStats): HTMLElement {
  const slide = document.createElement('div');
  slide.className = 'story-slide';
  slide.innerHTML = `
    <div class="slide-title">Your ${stats.year}</div>
    <div class="stat-value" style="font-size: 4rem; margin: 3rem 0;">Running Wrapped</div>
    <p style="font-size: 1.5rem;">Let's see how far you went</p>
  `;
  return slide;
}

function createTotalDistanceSlide(stats: RunningStats): HTMLElement {
  const slide = document.createElement('div');
  slide.className = 'story-slide';
  const totalKm = stats.totalDistance.toFixed(1);
  const marathons = (stats.totalDistance / 42.195).toFixed(1);

  slide.innerHTML = `
    <div class="slide-title">You ran</div>
    <div class="stat-value">${totalKm}</div>
    <div class="stat-label">kilometers</div>
    <p>That's equivalent to ${marathons} marathons!</p>
  `;
  return slide;
}

function createBestMonthSlide(stats: RunningStats): HTMLElement {
  const slide = document.createElement('div');
  slide.className = 'story-slide';
  const bestMonth = stats.bestMonth.month.split(' ')[0]; // Extract month name

  slide.innerHTML = `
    <div class="slide-title">Your best month</div>
    <div class="stat-value" style="font-size: 4rem;">${bestMonth}</div>
    <div class="stat-label">${stats.bestMonth.distance.toFixed(1)} km</div>
    <p>You were unstoppable!</p>
  `;
  return slide;
}

function createConsistencySlide(stats: RunningStats): HTMLElement {
  const slide = document.createElement('div');
  slide.className = 'story-slide';
  const percentage = ((stats.totalMonths / 12) * 100).toFixed(0);

  slide.innerHTML = `
    <div class="slide-title">You ran in</div>
    <div class="stat-value">${stats.totalMonths}</div>
    <div class="stat-label">months this year</div>
    <p>That's ${percentage}% of the year. Keep it up!</p>
  `;
  return slide;
}

function createAverageSlide(stats: RunningStats): HTMLElement {
  const slide = document.createElement('div');
  slide.className = 'story-slide';
  const avg = stats.avgDistancePerMonth.toFixed(1);

  slide.innerHTML = `
    <div class="slide-title">On average</div>
    <div class="stat-value">${avg}</div>
    <div class="stat-label">km per month</div>
    <p>Consistency is the key to progress</p>
  `;
  return slide;
}

function createStreakSlide(stats: RunningStats): HTMLElement {
  const slide = document.createElement('div');
  slide.className = 'story-slide';

  slide.innerHTML = `
    <div class="slide-title">Your longest streak</div>
    <div class="stat-value">${stats.milestones.bestStreak}</div>
    <div class="stat-label">consecutive months</div>
    <p>That's dedication!</p>
  `;
  return slide;
}

function createOutroSlide(stats: RunningStats): HTMLElement {
  const slide = document.createElement('div');
  slide.className = 'story-slide';

  slide.innerHTML = `
    <div class="slide-title">${stats.year} in numbers</div>
    <p style="font-size: 1.5rem; margin: 2rem 0; line-height: 1.8;">
      ${stats.totalDistance.toFixed(1)} km covered<br>
      ${stats.totalMonths} months active<br>
      ${stats.milestones.bestStreak} month streak
    </p>
    <p style="font-size: 1.8rem; font-weight: 700; margin-top: 3rem;">
      Here's to running even further in ${stats.year + 1}
    </p>
  `;
  return slide;
}
