import { Card, CardContent, Typography, Box } from '@mui/material';
import { colors } from '../theme/colors';

const StatCard = ({ title, value, icon, color = 'primary', trend, featured = false, subtitle }) => (
  <Card
    sx={{
      height: '100%',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      bgcolor: featured ? colors.brownCard : 'background.paper',
      color: featured ? '#fff' : 'inherit',
      border: featured ? 'none' : `1px solid ${colors.border}`,
      borderRadius: 3,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '@media (hover: hover)': {
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: featured ? '0 12px 24px rgba(123,75,42,0.25)' : '0 8px 24px rgba(230,126,34,0.12)',
        },
      },
    }}
  >
    <CardContent sx={{ position: 'relative', zIndex: 1, py: { xs: 2.5, sm: 3 }, px: { xs: 2.5, sm: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box minWidth={0}>
          <Typography
            variant="body2"
            gutterBottom
            sx={{ color: featured ? 'rgba(255,255,255,0.8)' : 'text.secondary', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: featured ? '#fff' : 'text.primary', lineHeight: 1.2, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: featured ? 'rgba(255,255,255,0.75)' : 'text.secondary', mt: 0.5, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: 'inline-block',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: trend.positive ? 'success.light' : 'error.light',
                color: trend.positive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {trend.label}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            bgcolor: featured ? 'rgba(255,255,255,0.18)' : `${color}.light`,
            color: featured ? '#fff' : `${color}.main`,
            p: { xs: 1, sm: 1.5 },
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': { fontSize: { xs: 20, sm: 24 } },
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
    {!featured && (
      <Box
        sx={{
          position: 'absolute',
          right: -8,
          bottom: -8,
          opacity: 0.07,
          fontSize: { xs: 64, sm: 88 },
          color: `${color}.main`,
          pointerEvents: 'none',
          overflow: 'hidden',
          '& svg': { fontSize: 'inherit' },
        }}
      >
        {icon}
      </Box>
    )}
  </Card>
);

export default StatCard;
