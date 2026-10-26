import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

crop_reco = pd.read_csv('training_the_dataset/Crop_recommendation.csv')
print(crop_reco)

# Get basic information about the columns and data types
print("\nDataset Info")
crop_reco.info()

# Check for missing values
print("\nMissing Values: ")
print(crop_reco.isnull().sum())

# Display unique labels/crops we want to recommend
print("\nX crops/ Target Crops: ")
unique_crops = crop_reco['label'].unique()

print(f"\nTotal unique crops: {len(unique_crops)}")
print(unique_crops)

# Split features 
X = crop_reco.drop('label', axis=1)
y = crop_reco['label']

from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import seaborn as sns

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Initialize the Decision Tree Classifier
clf = DecisionTreeClassifier(random_state=42)

# Train the model
clf.fit(X_train, y_train)

# Make predictions
y_pred = clf.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Calculate the confusion matrix
cm = confusion_matrix(y_test, y_pred, labels=clf.classes_)

# Plot the heatmap
plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=clf.classes_, yticklabels=clf.classes_)
plt.title('Confusion Matrix for Crop Recommendation')
plt.ylabel('Actual Crop')
plt.xlabel('Predicted Crop')
plt.show()
# Retrieve feature importances from the decision tree model
importances = clf.feature_importances_
feature_names = X.columns

# Create a DataFrame for easy sorting and plotting
feature_imp_df = pd.DataFrame({
    'Feature': feature_names,
    'Importance': importances
}).sort_values(by='Importance', ascending=False)

# Plot feature importances
plt.figure(figsize=(8, 5))
sns.barplot(x='Importance', y='Feature', data=feature_imp_df, palette='viridis', hue='Feature', legend=False)
plt.title('Feature Importances in Decision Tree Model')
plt.xlabel('Importance Score')
plt.ylabel('Feature')
plt.show()

from sklearn.metrics import classification_report

# Generate the classification report as a dictionary to analyze misclassifications programmatically
report_dict = classification_report(y_test, y_pred, output_dict=True)

# Print the text classification report
print("=== Detailed Classification Report ===")
print(classification_report(y_test, y_pred))

# Identify crops that do not have perfect scores (precision or recall < 1.0)
print("=== Crops with Misclassifications (Scores < 1.0) ===")
for crop, metrics in report_dict.items():
    if crop not in ['accuracy', 'macro avg', 'weighted avg']:
        precision = metrics['precision']
        recall = metrics['recall']
        if precision < 1.0 or recall < 1.0:
            print(f"Crop: {crop:<12} | Precision: {precision:.2f} | Recall: {recall:.2f} | F1-Score: {metrics['f1-score']:.2f}")


        from sklearn.tree import plot_tree

# Configure a large figure size for high resolution
plt.figure(figsize=(25, 15))

# Plot the decision tree (limiting max_depth to 3 for visual clarity)
plot_tree(
    clf, 
    feature_names=X.columns, 
    class_names=clf.classes_, 
    filled=True, 
    rounded=True, 
    fontsize=10, 
    max_depth=3
)

plt.title("Decision Tree Structure (Max Depth 3 for Readability)", fontsize=20)
plt.show()

from sklearn.model_selection import cross_val_score

# Perform 5-Fold Cross-Validation
cv_scores = cross_val_score(clf, X, y, cv=5)

# Print the results
print("=== 5-Fold Cross-Validation Results ===")
print(f"Individual Fold Accuracies: {cv_scores}")
print(f"Mean Accuracy: {cv_scores.mean() * 100:.2f}%")
print(f"Standard Deviation: {cv_scores.std() * 100:.2f}%")

import joblibG

# Save the trained model for your web application
joblib.dump(clf, 'crop_decision_model.pkl')
print("=== Model successfully saved as 'crop_decision_model.pkl' ===")