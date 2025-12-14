import { PricingPlan } from '../types';

interface PricingCardProps {
  plan: PricingPlan;
  onSelect?: (planId: string) => void;
}

export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(plan.id);
    }
  };

  return (
    <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
      {plan.isPopular && <div className="popular-badge">最受欢迎</div>}
      <div className="pricing-header">
        <h3 className="plan-name">{plan.name}</h3>
        <div className="price">
          <span className="amount">{plan.price}</span>
          <span className="period">/月</span>
        </div>
        <p className="description">{plan.description}</p>
      </div>
      <div className="features">
        {plan.features.map((feature, index) => (
          <div key={index} className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">{feature}</span>
          </div>
        ))}
      </div>
      <button className="cta-button" onClick={handleClick}>
        立即开始
      </button>
    </div>
  );
}
