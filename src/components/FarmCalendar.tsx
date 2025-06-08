
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Bell, CheckCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cropService, activityService } from '@/services/dataService';
import { format, addDays, differenceInDays } from 'date-fns';

const FarmCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch crops for timeline calculations
  const { data: userCrops = [] } = useQuery({
    queryKey: ['user-crops'],
    queryFn: cropService.getAll,
  });

  // Fetch farming activities
  const { data: activities = [] } = useQuery({
    queryKey: ['farming-activities'],
    queryFn: activityService.getAll,
  });

  // Generate upcoming tasks based on crop stages and planting dates
  const generateUpcomingTasks = () => {
    const tasks: any[] = [];
    const today = new Date();

    userCrops.forEach(crop => {
      const plantingDate = new Date(crop.planting_date);
      const daysFromPlanting = differenceInDays(today, plantingDate);
      
      // Define typical farming timeline
      const timeline = {
        maize: [
          { days: 7, task: 'First watering check', stage: 'germination' },
          { days: 14, task: 'Germination monitoring', stage: 'germination' },
          { days: 30, task: 'First fertilizer application', stage: 'vegetative' },
          { days: 45, task: 'Pest inspection', stage: 'vegetative' },
          { days: 60, task: 'Second fertilizer application', stage: 'flowering' },
          { days: 90, task: 'Harvest preparation', stage: 'maturity' },
          { days: 120, task: 'Harvest time', stage: 'harvest' },
        ],
        beans: [
          { days: 5, task: 'Germination check', stage: 'germination' },
          { days: 15, task: 'Thinning and weeding', stage: 'vegetative' },
          { days: 30, task: 'Flowering support', stage: 'flowering' },
          { days: 45, task: 'Pod formation check', stage: 'fruiting' },
          { days: 75, task: 'Harvest time', stage: 'harvest' },
        ],
        tomato: [
          { days: 10, task: 'Transplanting check', stage: 'vegetative' },
          { days: 20, task: 'Staking and support', stage: 'vegetative' },
          { days: 35, task: 'First fruit formation', stage: 'flowering' },
          { days: 50, task: 'Regular harvesting begins', stage: 'fruiting' },
          { days: 70, task: 'Peak harvest period', stage: 'harvest' },
        ],
      };

      const cropTimeline = timeline[crop.crop_type as keyof typeof timeline] || timeline.maize;
      
      cropTimeline.forEach(item => {
        const taskDate = addDays(plantingDate, item.days);
        const isUpcoming = taskDate >= today && differenceInDays(taskDate, today) <= 14;
        const isPast = taskDate < today;
        const isToday = differenceInDays(taskDate, today) === 0;

        if (isUpcoming || isToday) {
          tasks.push({
            id: `${crop.id}-${item.days}`,
            cropId: crop.id,
            cropName: crop.crop_type,
            task: item.task,
            date: taskDate,
            stage: item.stage,
            isToday,
            daysUntil: differenceInDays(taskDate, today),
            area: crop.area_hectares,
          });
        }
      });
    });

    return tasks.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const upcomingTasks = generateUpcomingTasks();
  const todayTasks = upcomingTasks.filter(task => task.isToday);

  // Recent activities
  const recentActivities = activities
    .sort((a, b) => new Date(b.date_performed).getTime() - new Date(a.date_performed).getTime())
    .slice(0, 5);

  const getTaskPriority = (daysUntil: number) => {
    if (daysUntil === 0) return 'high';
    if (daysUntil <= 3) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Tasks */}
      {todayTasks.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Bell className="h-5 w-5" />
              Today's Tasks ({todayTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{task.task}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {task.cropName} - {task.area} hectares
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {task.stage}
                    </Badge>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Done
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Tasks (Next 14 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const priority = getTaskPriority(task.daysUntil);
                
                return (
                  <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{task.task}</h4>
                          <Badge variant={getPriorityColor(priority)}>
                            {task.daysUntil === 0 ? 'Today' : `${task.daysUntil} days`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">
                          {task.cropName} - {task.area} hectares
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(task.date, 'MMM dd, yyyy')} • {task.stage} stage
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <Button size="sm" variant="outline">
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Tasks</h3>
              <p className="text-gray-600">All caught up! Check back later for new tasks.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Farm Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.activity_type}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      {activity.cost && (
                        <p className="text-sm text-green-600 mt-1">Cost: M{activity.cost}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {format(new Date(activity.date_performed), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No recent activities recorded.</p>
              <Button className="mt-4" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crop Calendar Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Crop Growth Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userCrops.map((crop) => {
              const plantingDate = new Date(crop.planting_date);
              const daysFromPlanting = differenceInDays(new Date(), plantingDate);
              const expectedHarvest = crop.expected_harvest_date ? new Date(crop.expected_harvest_date) : null;
              const daysToHarvest = expectedHarvest ? differenceInDays(expectedHarvest, new Date()) : null;
              
              return (
                <div key={crop.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium capitalize">{crop.crop_type}</h4>
                      <p className="text-sm text-gray-600">{crop.area_hectares} hectares</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {crop.growth_stage}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        Day {daysFromPlanting} from planting
                      </p>
                      {daysToHarvest !== null && daysToHarvest > 0 && (
                        <p className="text-xs text-green-600">
                          {daysToHarvest} days to harvest
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmCalendar;
