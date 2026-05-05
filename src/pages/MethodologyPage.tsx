import { Box, Container, Paper, Typography } from '@mui/material';

const MethodologyPage = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Методика
                    </Typography>
                    <Typography variant="body1">
                        Здесь будет описание методики
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default MethodologyPage;