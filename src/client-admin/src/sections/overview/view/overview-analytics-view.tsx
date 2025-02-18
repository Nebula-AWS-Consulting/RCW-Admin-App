import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsTransactionForm } from '../analytics-transaction-form';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Weekly Bible Studies"
            percent={2.6}
            total={102}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [80, 87, 79, 68, 72, 84, 77, 92],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New Baptisms"
            percent={-20}
            total={6}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [5, 4, 4, 6, 3, 3, 5, 7],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Church Income"
            percent={-15.8}
            total={172331}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20000, 20700, 25000, 28000, 27000, 25000, 27000, 24000],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Overall Church Growth"
            percent={32.6}
            total={42}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [7, 3, 12, 5, 7, 4, 2, 7],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Weekly Bible Studies"
            chart={{
              series: [
                { label: 'Campus', value: 60 },
                { label: 'Singles', value: 25 },
                { label: 'Marrieds', value: 15 },
                { label: 'Teens', value: 5 },
                { label: 'Spanish', value: 5 }
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Bible Studies that Lead to succession"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Seeking God', 'Word of God', 'Discipleship', 'Persecution', 'Kingdom', 'Light & Darkness', 'Confession & Repentance', 'The Church', 'Counting the Cost'],
              series: [
                { name: 'Campus', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Singles', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                { name: 'Marrieds', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                { name: 'Teens', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                { name: 'Spanish', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] }
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Campus', 'Singles', 'Marrieds', 'Teens', 'Spanish'],
              series: [
                { name: '2024', data: [2440, 2505, 2410, 2640, 2209] },
                { name: '2025', data: [53, 32, 33, 52, 33] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Bible Talk Bible studies"
            chart={{
              categories: ['SG', 'WoG', 'Discipleship', 'Persecution', 'Kingdom', 'L & D'],
              series: [
                { name: 'BT 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'BT 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'BT 4', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTransactionForm />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Growth Timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 }
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Goals" list={_tasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
