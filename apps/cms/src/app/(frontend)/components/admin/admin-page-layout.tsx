'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@frontend/components/ui/input';

// Create a single QueryClient instance
const queryClient = new QueryClient();

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  createButtonLabel?: string;
  onCreateClick?: () => void;
  showCreateButton?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  stats?: Array<{
    label: string;
    value: string | number;
    description?: string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }>;
}

function AdminPageLayoutComponent({
  title,
  description,
  children,
  createButtonLabel = 'Créer',
  onCreateClick,
  showCreateButton = true,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  filters,
  stats,
}: AdminPageLayoutProps) {
  const getStatColorClasses = (color: string = 'blue') => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        
        {showCreateButton && onCreateClick && (
          <Button onClick={onCreateClick} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {createButtonLabel}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className={`border ${getStatColorClasses(stat.color)}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.description && (
                  <p className="text-xs opacity-80 mt-1">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      {(onSearchChange || filters) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filtres et recherche
            </CardTitle>
            <CardDescription>
              Utilisez les filtres pour affiner les résultats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {onSearchChange && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchValue || ''}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              {filters && (
                <div className="flex flex-wrap gap-4">
                  {filters}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}

export default function AdminPageLayout(props: AdminPageLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminPageLayoutComponent {...props} />
    </QueryClientProvider>
  );
}