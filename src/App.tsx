import { useState } from 'react';
import './styles/main.css';
import PricingCard from './components/PricingCard';
import Toast from './components/Toast';
import { PricingPlan } from './types';

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: '基础版',
    price: '99',
    description: '适合个人用户，满足基本需求',
    features: [
      '1个用户账号',
      '10GB 存储空间',
      '基本功能支持',
      '邮件技术支持'
    ]
  },
  {
    id: 'pro',
    name: '专业版',
    price: '299',
    description: '适合团队用户，功能更加强大',
    features: [
      '10个用户账号',
      '100GB 存储空间',
      '所有高级功能',
      '24/7 技术支持',
      '优先处理请求'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: '899',
    description: '适合大型企业，定制化服务',
    features: [
      '无限用户账号',
      '无限存储空间',
      '定制化功能开发',
      '专属技术支持经理',
      '高级安全保障'
    ]
  }
];

export default function App() {
  const [showToast, setShowToast] = useState(false);

  const handlePlanSelect = (planId: string) => {
    // 显示轻提示
    setShowToast(true);
  };

  return (
    <div className="pricing-container">
      <h1 className="pricing-title">选择适合您的定价方案</h1>
      <p className="pricing-subtitle">
        根据您的需求选择合适的套餐，满足个人、团队或企业的不同需求
      </p>
      <div className="pricing-grid">
        {pricingPlans.map(plan => (
          <PricingCard key={plan.id} plan={plan} onSelect={handlePlanSelect} />
        ))}
      </div>
      <Toast
        message="功能正在开发中"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
