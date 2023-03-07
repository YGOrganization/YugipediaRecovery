export type ProgressBarProps = {
	value: number
};

export default function ProgressBar({ value }: ProgressBarProps) {
	const progressPercent = 100 * value;

	return (
		<div className="progress-container">
			<div className="progress" style={{ width: `${progressPercent}%` }}>
				{progressPercent.toFixed(2)}%
			</div>
		</div>
	);
}
