import { Box, Container, Paper, Typography } from '@mui/material';

const ReportsPage = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Отчеты
                    </Typography>
                    <Typography variant="body1">
                        Здесь будут отображаться отчеты
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default ReportsPage;