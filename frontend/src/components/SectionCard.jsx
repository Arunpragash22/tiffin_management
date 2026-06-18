import { Card, CardContent, Typography, Box } from '@mui/material';
import { colors } from '../theme/colors';

const SectionCard = ({ title, subtitle, action, children, noPadding = false, titleAlign = 'left' }) => (
  <Card
    sx={{
      borderRadius: 2,
      border: `1px solid ${colors.border}`,
      width: '100%',
      minWidth: 0,
      bgcolor: 'background.paper',
    }}
  >
    {(title || action) && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: titleAlign === 'right' && !action ? 'flex-end' : 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 1.5,
          px: { xs: 2.5, sm: 3 },
          pt: { xs: 2.5, sm: 3 },
          pb: { xs: 2, sm: 2.25 },
          borderBottom: `1px solid ${colors.border}`,
          bgcolor: '#FAFAFA',
          minWidth: 0,
          borderTopLeftRadius: (theme) => theme.shape.borderRadius * 2,
          borderTopRightRadius: (theme) => theme.shape.borderRadius * 2,
        }}
      >
        <Box minWidth={0} sx={{ textAlign: titleAlign, ...(titleAlign === 'right' && !action ? { width: '100%' } : {}) }}>
          {title && (
            <Typography
              component="div"
              variant="subtitle1"
              fontWeight={700}
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem' },
                lineHeight: 1.5,
                m: 0,
                py: 0.25,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary" display="block">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    )}
    {noPadding ? (
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          borderBottomLeftRadius: (theme) => theme.shape.borderRadius * 2,
          borderBottomRightRadius: (theme) => theme.shape.borderRadius * 2,
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    ) : (
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } }, overflow: 'visible' }}>
        {children}
      </CardContent>
    )}
  </Card>
);

export default SectionCard;
