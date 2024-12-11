import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ onSearch, fields }) => {
  const [searchParams, setSearchParams] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rangeValues, setRangeValues] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ ...searchParams, ranges: rangeValues });
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRangeChange = (field, type, value) => {
    setRangeValues(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value
      }
    }));
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search..."
              onChange={(e) => handleInputChange('query', e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === 'range' ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        onChange={(e) => handleRangeChange(field.name, 'min', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        onChange={(e) => handleRangeChange(field.name, 'max', e.target.value)}
                      />
                    </div>
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchBar; 