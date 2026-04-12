import Layout from '@/components/Layout';
import EventsSection from '@/components/EventsSection';

const Events = () => (
  <Layout>
    <div className="pt-8">
      <EventsSection limit={12} showHeader={true} />
    </div>
  </Layout>
);

export default Events;
