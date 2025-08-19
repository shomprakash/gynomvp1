import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Clock, Tag, ExternalLink, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';

interface WikiArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  author_type: 'standard' | 'gyno_expert';
  is_verified: boolean;
  verification_sources?: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

const WikiArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle();
      incrementViewCount();
    }
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wiki_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        navigate('/wiki');
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Error:', error);
      navigate('/wiki');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    if (!id) return;
    
    try {
      await supabase.rpc('increment_view_count', { article_id: id });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <Separator />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Article not found</h2>
            <Button onClick={() => navigate('/wiki')} className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gynobase
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/wiki')}
            className="rounded-full mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gynobase
          </Button>
        </div>

        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <CardTitle className="text-3xl font-serif leading-tight">
                {article.title}
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Created {formatDate(article.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author_type === 'gyno_expert' ? 'Medical Expert' : 'Community Contributor'}
                </div>
                {article.is_verified && (
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Medically Verified</span>
                  </div>
                )}
                <Badge variant="outline" className="capitalize">
                  {article.category.replace('_', ' ')}
                </Badge>
              </div>

              {article.summary && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-lg leading-relaxed font-medium">
                    {article.summary}
                  </p>
                </div>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {user && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/wiki/edit/${article.id}`)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Suggest Edit
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Verification Sources */}
        {article.verification_sources && article.verification_sources.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Medical Sources & References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {article.verification_sources.map((source, index) => (
                  <li key={index} className="text-sm">
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline break-all"
                    >
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with qualified healthcare providers for diagnosis and treatment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WikiArticlePage;