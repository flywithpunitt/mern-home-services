// DashboardMap.jsx
export const DashboardMap = React.forwardRef(({ currentMarker }, ref) => (
    <div 
      ref={ref}
      id="dashboard-map" 
      className="w-full h-[40vh] z-0 bg-blue-100"
    />
  ));
  