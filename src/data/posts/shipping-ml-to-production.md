The gap between a model that works on your laptop and one that runs reliably in a live logistics system is wider than most people expect. I've shipped a few now: address error detection, destination facility prediction, and the pattern is always the same. The model is the easy part.

## Data in production looks nothing like training data

You train on a clean export. Production sends you free-text address fields with typos, mixed languages, missing postal codes, and encoding issues that only appear at 2am on a Tuesday. The first week after go-live is mostly fixing input parsing, not the model itself.

## Thresholds matter more than accuracy

A model with 94% accuracy sounds good. But what happens to the 6%? In logistics, a wrong prediction doesn't just show a bad recommendation; it can route a shipment to the wrong facility, which costs real money and time. You end up spending more time on the confidence threshold and fallback logic than on the model architecture.

## Monitoring is the feature nobody asks for

Stakeholders ask for predictions. Nobody asks for drift detection, input distribution monitoring, or latency alerts. But without them, you won't know when your model quietly starts degrading, and in a logistics context, silent failures are the worst kind.

## The boring stuff is the actual work

Logging. Versioning. Rollback procedures. Documentation that someone else can actually read. These feel like overhead until something goes wrong at 3pm on a Friday before a long weekend, and suddenly they're the only thing that matters.

None of this is a complaint. It's an accurate description of what the job actually is. The model is maybe 20% of the effort. The other 80% is building the scaffolding that lets it live somewhere real.
