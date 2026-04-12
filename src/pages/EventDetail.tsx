import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { usePublicData } from '@/hooks/usePublicData';

const EventDetail = () => {
  const { id } = useParams();
  const { eventsQuery } = usePublicData();
  
  if (eventsQuery.isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </Layout>
    );
  }

  const event = eventsQuery.data?.find((e: any) => e.id === id);

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">The event you are looking for does not exist or has been removed.</p>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
        <Link to="/events">
          <Button variant="ghost" className="mb-6 gap-2 hover:bg-muted">
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Button>
        </Link>
        
        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-md">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            {event.category}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{event.title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="h-5 w-5 text-primary" /> 
            {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      </article>
    </Layout>
  );
};

export default EventDetail;
