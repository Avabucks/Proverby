export default function QuizComingSoon() {
  return (
    <div className="overflow-hidden">
      {/* Content */}
      <div className="w-full">

        {/* Main Card */}
        <div className="w-full"
          style={{
            borderRadius: '20px',
          }}>

          {/* Status Message */}
          <div className="p-4 sm:p-6 mb-8 sm:mb-10 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(102, 72, 175, 0.08) 0%, rgba(138, 99, 224, 0.08) 100%)',
              border: '2px dashed rgba(102, 72, 175, 0.3)'
            }}>
            <p className="text-base sm:text-lg font-semibold flex items-center justify-center gap-2 flex-wrap"
              style={{ color: 'rgb(102, 72, 175)' }}>
              <span className="text-xl sm:text-2xl">🚀</span>
              <span>Coming Soon - Lancio previsto a breve</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}