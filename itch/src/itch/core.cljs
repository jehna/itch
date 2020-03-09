(ns itch.core
  (:require [reagent.core :as reagent :refer [atom]]
            [clojure.tools.reader :as r]
            [clojure.tools.reader.edn :as edn]
            [cljs.js :as cljs]
            [lentes.core :as l]
            [cljs.core.match :refer-macros [match]]
            [cljs.analyzer :as ana]))

(enable-console-print!)

;(println "This text is printed from src/itch/core.cljs. Go ahead and edit it and see reloading in action.")

;(println (with-out-str (cljs.pprint/pprint (ana/analyze (ana/empty-env) (edn/read-string "(+ 1 1)")))))
;https://github.com/swannodette/swannodette.github.com/blob/master/code/blog/src/blog/cljs_next/core.cljs
;http://swannodette.github.io/2015/07/29/clojurescript-17
(defn elide-env [env ast opts]
  (dissoc ast :env))
(def st (cljs/empty-state))
(def ast (atom nil))

(defn add-coords [value]
  (->> value
       (merge {:x 0 :y 0})
       (l/over (l/key :args) #(map add-coords %))
       ))

(defn add-coords-root [root]
  (l/over (l/key :value) add-coords root))

(cljs/analyze-str st "(+ 1 (+ 2 3))" nil
                  {:passes [ana/infer-type elide-env]}
                  (fn [{:keys [error value] :as res}]
                    (reset! ast (add-coords-root res))))
(defn all-items [ast] (flatten [ast (map all-items (:args ast))]))

(defn get-name [ast]
  (match [(:op ast)]
    [:js] (name (:js-op ast))
    [:const] (:val ast)
    :else (:op ast)))

(defonce app-state (atom {:text "Hello world!"}))

(defn nest-lens-nodes [ast]
  (concat
   [ast]
   (map-indexed
    #(nest-lens-nodes (l/derive (comp (l/key :args) (l/nth %)) ast)) (:args @ast))))

(defn nodes-to-connections
  [[from & tos]]
  (flatten
   (concat
    (map (fn [[to]] {:from from :to to}) tos)
    (map nodes-to-connections tos))))

(defn node-renderer
  [ast]
  [:<>
   [:rect {:width 100 :height 100 :x (:x @ast) :y (:y @ast) :stroke "#000" :fill "none"}]
   [:text {:x (+ 35 (:x @ast)) :y (+ 65 (:y @ast)) :style {:font-size 50}} (get-name @ast)]])

(defn connection-renderer
  [in]
  (let [from (:from in)
        to (:to in)]
       
       [:line {:x1 (:x @from)
               :x2 (:x @to)
               :y1 (:y @from)
               :y2 (:y @to)}]))

(defn hello-world []
  [:div
   #_[:pre (with-out-str (cljs.pprint/pprint (all-items (:value @ast))))]
   [:pre (with-out-str (cljs.pprint/pprint @ast))]
   [:svg {:viewBox "0 0 1024 762" :width 1024 :height 762 :xmlns "http://www.w3.org/2000/svg"}
    (map node-renderer (flatten (nest-lens-nodes (l/derive (l/key :value) ast))))
    (map connection-renderer (nodes-to-connections (nest-lens-nodes (l/derive (l/key :value) ast))))
    ]])

(reagent/render-component [hello-world]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
  )
