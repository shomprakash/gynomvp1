import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, BookOpen, Clock, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WikiArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  author_type: 'standard' | 'gyno_expert';
  is_verified: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

const WikiPage = () => {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'all',
    'reproductive_health',
    'conditions',
    'contraception',
    'pregnancy',
    'menopause',
    'sexual_health',
    'preventive_care'
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('wiki_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-2">
                Gynobase
              </h1>
              <p className="text-muted-foreground text-lg">
                Collaborative Women's Health Knowledge Base
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search gynecological topics, conditions, treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg rounded-full border-2 border-primary/20 focus:border-primary"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full text-sm capitalize"
                >
                  {category.replace('_', ' ')}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => navigate('/wiki/new')}
                className="rounded-full bg-primary hover:bg-primary/90"
                disabled={!user}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Article
              </Button>
              {user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="rounded-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try different search terms' : 'Be the first to contribute!'}
              </p>
              {user && (
                <Button onClick={() => navigate('/wiki/new')} className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Article
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {articles.map((article) => (
              <Card 
                key={article.id} 
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
                onClick={() => navigate(`/wiki/article/${article.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(article.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.author_type === 'gyno_expert' ? 'Medical Expert' : 'Community'}
                        </div>
                        {article.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-4 capitalize">
                      {article.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {article.summary || truncateContent(article.content)}
                  </p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {article.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +{article.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Gynobase is a collaborative platform for women's health information. 
            All medical content should be verified with healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WikiPage;