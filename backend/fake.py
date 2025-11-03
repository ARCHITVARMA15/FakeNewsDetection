import numpy as np
import pandas as pd

true = pd.read_csv('True.csv')

fake  = pd.read_csv('Fake.csv')

print(true.head())
print(fake.head())

true['label'] = 1
fake['label'] = 0

print(true.head())

news = pd.concat([true, fake], axis=0)

print(news.head())

print(news.tail())

print(news.isnull().sum())

news = news.drop(['title', 'subject', 'date'],axis=1)
print(news.head())

#reshuflling to remove bias 
news = news.sample(frac=1)
print(news.head())

news.reset_index(inplace= True)

print(news.head())

#so now the preprocessing is done
#now we ll perform feature extraction 

#TFIDF
import re 

#making the text more computer understandable->optimising the text 

def wordopt(text):
    #convert to lowercase 
    text = text.lower()

    #Remove the URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    #Remove HTML tags
    text = re.sub(r'<.*?>', '', text)

    #remove punctuaution ansd special character from it 
    text = re.sub(r'[^\w\s]','', text)

    #Remove Digits
    text = re.sub(r'\d','',text)

    #remove newline characters
    text = re.sub(r'\n','', text)

    return text

#applying the function 
news['text'] = news['text'].apply(wordopt)

print(news['text'])

x = news['text']
y = news['label']

print(x)
print(y)

from sklearn.model_selection import train_test_split

x_train , x_test, y_train, y_test = train_test_split(x, y,test_size = 0.3)
#30 percent data will be used for testing purpose

print(x_train.shape)
print(x_test.shape)

#creating vecctors using Tfidf 

from sklearn.feature_extraction.text import TfidfVectorizer
vectorization = TfidfVectorizer(max_features=5000)

xv_train = vectorization.fit_transform(x_train)
xv_test = vectorization.transform(x_test)

print(xv_train)
print(xv_test)

#training of ML model finally starts here 
from sklearn.linear_model import LogisticRegression 

LR = LogisticRegression()

LR.fit(xv_train, y_train)
pred_lr = LR.predict(xv_test)

print(LR.score(xv_test, y_test))


from sklearn.metrics import classification_report
print("LR:",classification_report(y_test, pred_lr))

#trying Decision Tree Classifier 

from sklearn.tree import DecisionTreeClassifier

DTC = DecisionTreeClassifier()

DTC.fit(xv_train, y_train)

pred_dtc = DTC.predict(xv_test)

print(DTC.score(xv_test, y_test))

print("DTC:",classification_report(y_test, pred_dtc))

#Ensemble Method -random forest classifier 
from sklearn.ensemble import RandomForestClassifier

rfc = RandomForestClassifier()

rfc.fit(xv_train, y_train)

rfc_pred = rfc.predict(xv_test)

print(rfc.score(xv_test, y_test))

print("RFC:", classification_report(y_test, rfc_pred))

#Gradient Boosting Classifier 
from sklearn.ensemble import GradientBoostingClassifier 
gbc =   GradientBoostingClassifier()

gbc.fit(xv_train, y_train)

gbc_pred = gbc.predict(xv_test)
print(gbc.score(xv_test, y_test))
print("GBC:", classification_report(y_test, gbc_pred))



import pickle

# Save your models
with open("model_lr.pkl", "wb") as f:
    pickle.dump(LR, f)

with open("model_rfc.pkl", "wb") as f:
    pickle.dump(rfc, f)

with open("model_gbc.pkl", "wb") as f:
    pickle.dump(gbc, f)

# Save your vectorizer
with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorization, f)

print("✅ Models and vectorizer saved successfully!")


def output_label(n):
    if n ==0:
        return "It is a Fake news"
    elif n ==1:
        return "It is a genuine news"
    
def manual_testing(news_text):
    testing_news = {"text":[news_text]} #Corrected syntax for defining dictionary
    new_df_test = pd.DataFrame(testing_news)
    new_df_test['text'] = new_df_test['text'].apply(wordopt) 
    new_x_test = new_df_test['text']
    new_xv_test = vectorization.transform(new_x_test)
    pred_lr = LR.predict(new_xv_test)
    #pred_dtc = DTC.predict(new_xv_test)
    rfc_pred = rfc.predict(new_xv_test)
    gbc_pred = gbc.predict(new_xv_test)

    return "\n\nLR Prediction:{} \n GBC Prediction:{}\nRFC Prediction:{}".format(
        output_label(pred_lr[0]), output_label(gbc_pred[0]), output_label(rfc_pred[0])
    )

news_article = str(input("Enter the news article:"))
print(manual_testing(news_article))

