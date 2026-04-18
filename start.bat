@echo off
echo Starting Flight Booking Project...

docker compose up -d

echo.
echo All services starting...
echo Wait 2-3 minutes then open: http://localhost:4200
echo Eureka Dashboard: http://localhost:8761
pause
